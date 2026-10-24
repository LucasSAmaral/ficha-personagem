import React from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
import useAutoSave, { AutoSaveStatus } from "./useAutoSave";

type Hook = {
  status: AutoSaveStatus;
  online: boolean;
  queue: (value: number) => void;
  isDirty: () => boolean;
};

const setup = (save: (value: number) => Promise<unknown>) => {
  const result: { current: Hook | null } = { current: null };
  const Probe: React.FC = () => {
    result.current = useAutoSave<number>(save);
    return null;
  };
  const container = document.createElement("div");
  act(() => {
    ReactDOM.render(<Probe />, container);
  });
  const hook = () => result.current as Hook;
  return { hook, container };
};

const flushPromises = () => new Promise(resolve => setImmediate(resolve));

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

test("agrupa mudanças seguidas numa gravação só, com o último valor", async () => {
  const save = jest.fn(() => Promise.resolve());
  const { hook } = setup(save);

  act(() => {
    hook().queue(1);
    hook().queue(2);
    hook().queue(3);
  });
  expect(hook().status).toBe("pending");
  expect(hook().isDirty()).toBe(true);
  expect(save).not.toHaveBeenCalled();

  act(() => {
    jest.advanceTimersByTime(1000);
  });
  expect(save).toHaveBeenCalledTimes(1);
  expect(save).toHaveBeenCalledWith(3);

  await act(async () => {
    await flushPromises();
  });
  expect(hook().status).toBe("saved");
  expect(hook().isDirty()).toBe(false);
});

test("tenta de novo depois de um erro", async () => {
  const save = jest
    .fn()
    .mockImplementationOnce(() => Promise.reject(new Error("offline")))
    .mockImplementation(() => Promise.resolve());
  const { hook } = setup(save);

  act(() => {
    hook().queue(7);
    jest.advanceTimersByTime(1000);
  });
  await act(async () => {
    await flushPromises();
  });
  expect(hook().status).toBe("error");
  expect(hook().isDirty()).toBe(true);

  act(() => {
    jest.advanceTimersByTime(5000);
  });
  await act(async () => {
    await flushPromises();
  });
  expect(save).toHaveBeenCalledTimes(2);
  expect(save).toHaveBeenLastCalledWith(7);
  expect(hook().status).toBe("saved");
});

test("grava na hora quando a página é escondida", async () => {
  const save = jest.fn(() => Promise.resolve());
  const { hook } = setup(save);

  act(() => {
    hook().queue(4);
  });
  Object.defineProperty(document, "visibilityState", {
    configurable: true,
    get: () => "hidden"
  });
  act(() => {
    document.dispatchEvent(new Event("visibilitychange"));
  });
  expect(save).toHaveBeenCalledWith(4);

  await act(async () => {
    await flushPromises();
  });
  expect(hook().status).toBe("saved");
});

test("grava o pendente ao sair da ficha", () => {
  const save = jest.fn(() => Promise.resolve());
  const { hook, container } = setup(save);

  act(() => {
    hook().queue(9);
  });
  act(() => {
    ReactDOM.unmountComponentAtNode(container);
  });
  expect(save).toHaveBeenCalledWith(9);
});

test("não grava nada sem mudança do jogador", () => {
  const save = jest.fn(() => Promise.resolve());
  const { container } = setup(save);

  act(() => {
    jest.advanceTimersByTime(10000);
    ReactDOM.unmountComponentAtNode(container);
  });
  expect(save).not.toHaveBeenCalled();
});

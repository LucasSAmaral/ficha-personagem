import React, { useState } from "react";
import styled from "styled-components";
import Button from "../../../components/Button.component";
import {
  FieldInput,
  FieldLabel,
  FieldWrapper
} from "../../../components/FormInput.component";
import StatCounter from "../../../components/StatCounter.component";
import { FocusCssStyle, LabelCssStyle, media } from "../../../theme/tokens";
import { Monstro } from "../uivo-do-lobisomem-personagem.component";

type EncontrosMonstrosComponentProps = {
  monstros: Array<Monstro>;
  onChange: (monstros: Array<Monstro>) => void;
};

const novoId = () =>
  `${Date.now().toString(36)}${Math.random()
    .toString(36)
    .slice(2, 6)}`;

const EncontrosMonstrosComponent: React.FC<EncontrosMonstrosComponentProps> = ({
  monstros,
  onChange
}) => {
  const [nome, setNome] = useState("");
  const [habilidade, setHabilidade] = useState("");
  const [energia, setEnergia] = useState("");
  const [erro, setErro] = useState("");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const habilidadeNumero = Number.parseInt(habilidade);
    const energiaNumero = Number.parseInt(energia);

    if (!nome.trim() || isNaN(habilidadeNumero) || isNaN(energiaNumero)) {
      setErro("Preencha o nome, a Habilidade e a Energia do monstro.");
      return;
    }

    onChange([
      ...monstros,
      {
        id: novoId(),
        nome: nome.trim(),
        habilidade: habilidadeNumero,
        energia: energiaNumero
      }
    ]);
    setNome("");
    setHabilidade("");
    setEnergia("");
    setErro("");
  };

  const updateMonstro = (id: string, changes: Partial<Monstro>) =>
    onChange(
      monstros.map(monstro =>
        monstro.id === id ? { ...monstro, ...changes } : monstro
      )
    );

  return (
    <EncontrosMonstros aria-labelledby="encontros-titulo">
      <EncontrosMonstrosTitle id="encontros-titulo">
        Encontros com monstros
      </EncontrosMonstrosTitle>

      {monstros.length > 0 ? (
        <EncontrosMonstrosGrid>
          {monstros.map(monstro => (
            <MonstroBox key={monstro.id} $derrotado={monstro.energia <= 0}>
              <MonstroHead>
                <MonstroNome>{monstro.nome}</MonstroNome>
                {monstro.energia <= 0 && <MonstroFlag>Derrotado</MonstroFlag>}
              </MonstroHead>
              <MonstroHabilidade>
                Habilidade <b>{monstro.habilidade}</b>
              </MonstroHabilidade>
              <StatCounter
                id={`monstro-${monstro.id}`}
                label="Energia"
                kind="vital"
                min={0}
                value={monstro.energia}
                onChange={energia => updateMonstro(monstro.id, { energia })}
              />
              <MonstroRemove
                type="button"
                aria-label={`Remover ${monstro.nome}`}
                onClick={() =>
                  onChange(monstros.filter(m => m.id !== monstro.id))
                }
              >
                Remover
              </MonstroRemove>
            </MonstroBox>
          ))}
        </EncontrosMonstrosGrid>
      ) : (
        <EncontrosMonstrosEmpty>
          Nenhum monstro no caminho, por enquanto.
        </EncontrosMonstrosEmpty>
      )}

      <EncontrosMonstrosForm onSubmit={onSubmit}>
        <FieldWrapper>
          <FieldLabel htmlFor="monstro-nome">Monstro</FieldLabel>
          <FieldInput
            id="monstro-nome"
            type="text"
            value={nome}
            onChange={e => setNome(e.target.value)}
          />
        </FieldWrapper>
        <FieldWrapper>
          <FieldLabel htmlFor="monstro-habilidade">Habilidade</FieldLabel>
          <FieldInput
            id="monstro-habilidade"
            type="number"
            inputMode="numeric"
            value={habilidade}
            onChange={e => setHabilidade(e.target.value)}
          />
        </FieldWrapper>
        <FieldWrapper>
          <FieldLabel htmlFor="monstro-energia">Energia</FieldLabel>
          <FieldInput
            id="monstro-energia"
            type="number"
            inputMode="numeric"
            value={energia}
            onChange={e => setEnergia(e.target.value)}
          />
        </FieldWrapper>
        <Button type="submit" $quiet $inline>
          Adicionar monstro
        </Button>
      </EncontrosMonstrosForm>
      {erro && (
        <EncontrosMonstrosErro role="alert">{erro}</EncontrosMonstrosErro>
      )}
    </EncontrosMonstros>
  );
};

const EncontrosMonstros = styled.section`
  grid-area: monstros;
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  min-width: 0;
`;

const EncontrosMonstrosTitle = styled.h2`
  font-family: var(--fp-heading-font);
  font-weight: var(--fp-heading-weight);
  font-size: 26px;
  line-height: 30px;
`;

const EncontrosMonstrosGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--space-md);
`;

const MonstroBox = styled.article<{ $derrotado: boolean }>`
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  margin: 4px;
  padding: var(--space-sm);
  background: var(--surface-raised);
  border: 1px solid var(--line);
  outline: 1px solid var(--hairline);
  outline-offset: 3px;
  border-style: ${({ $derrotado }) => ($derrotado ? "dashed" : "solid")};
`;

const MonstroHead = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-xs);
`;

const MonstroNome = styled.h3`
  min-width: 0;
  font-family: var(--fp-heading-font);
  font-weight: var(--fp-heading-weight);
  font-size: 22px;
  line-height: 26px;
  overflow-wrap: anywhere;
`;

const MonstroFlag = styled.span`
  ${LabelCssStyle}
  font-size: 13px;
  color: var(--danger);
`;

const MonstroHabilidade = styled.span`
  ${LabelCssStyle}

  b {
    font-family: var(--fp-stat-font);
    font-size: 20px;
    color: var(--ink);
  }
`;

const MonstroRemove = styled.button`
  ${LabelCssStyle}
  ${FocusCssStyle}
  align-self: flex-start;
  min-height: var(--control-min);
  background: none;
  border: 0;
  cursor: pointer;

  &:hover {
    color: var(--danger);
    text-decoration: underline;
  }
`;

const EncontrosMonstrosEmpty = styled.p`
  font-style: italic;
  color: var(--ink-muted);
`;

const EncontrosMonstrosForm = styled.form`
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1fr) minmax(0, 1fr) auto;
  align-items: end;
  gap: var(--space-xs);

  ${media.mobile} {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);

    ${FieldWrapper}:first-child {
      grid-column: 1 / -1;
    }

    button {
      grid-column: 1 / -1;
    }
  }
`;

const EncontrosMonstrosErro = styled.p`
  color: var(--danger);
`;

export default EncontrosMonstrosComponent;

# Minha Trilha — Qualidade + Tecnologia

Site estático para planejar cursos, acompanhar conquistas e manter um currículo editável.

## Recursos

- Cronograma com os cursos planejados, links, instituições e estimativas de investimento.
- Checklist dos cursos da trilha e **cadastro de cursos adicionais** sem quantidade fixa.
- Inclusão de cursos como **formação acadêmica**, **curso complementar** ou **certificação profissional**.
- Edição e exclusão de cursos personalizados, com marcação de conclusão.
- Currículo completo e editável: identificação, contatos, objetivo, resumo, experiência, graduação, pós-graduação, formações adicionais, competências, idiomas, certificações e outras seções.
- Edição do texto de cada conquista padrão da trilha, incluindo a possibilidade de ocultá-la no currículo.
- Personalização dos títulos das seções.
- Prévia atualizada automaticamente: cursos da trilha aparecem quando o respectivo item é marcado como concluído. A pós-graduação pode aparecer como "em andamento" após a marcação da matrícula.
- Copiar currículo como texto ou imprimir/salvar em PDF no formato A4.
- **Baixar backup / Restaurar backup** para guardar e transferir os dados.

## Onde os dados ficam

Não há conta de usuário nem sincronização online nesta versão. As preferências, o currículo, as marcações e os cursos personalizados são salvos no **localStorage do navegador**, no dispositivo atual.

Para transferir as informações para outro navegador ou evitar perdas ao limpar os dados, utilize **Baixar backup** e depois **Restaurar backup**. Restaurar substitui o currículo, a checklist e os cursos personalizados do navegador de destino.

## Como usar

Abra o site, selecione **Checklist & Currículo** e:

1. Clique em **Editar currículo** para alterar os campos do currículo, inclusive os textos dos cursos da trilha e títulos das seções.
2. Clique em **+ Adicionar curso** para criar um curso adicional. Escolha sua categoria, adicione instituição e outras informações, e marque quando concluir.
3. Para cursos personalizados, use **Editar** ou **Excluir** na checklist.
4. Confira a prévia e use **Copiar currículo** ou **Salvar em PDF**.
5. Faça backups periódicos.

## Tecnologia

HTML, CSS e JavaScript puro, sem dependências, sem build e sem backend. Arquivos principais: `index.html`, `styles.css`, `script.js`.

As datas, valores e links das formações existentes são referências de planejamento e devem ser confirmados com cada instituição.

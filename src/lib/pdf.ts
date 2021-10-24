export type Answer = {
  question: string
  questionAnswer: string
  selectedOption: string
  indent: number
}

export type Answers = Answer[]

export function createPdf(name: string, answers: Answers) {
  const ctx: any[] = []

  ctx.push({
    text: name, fontSize: 20, alignment: 'center',
  })

  ctx.push(' ')
  ctx.push(' ')

  answers.forEach((answer) => {
    ctx.push({
      text: `${answer.question} (${answer.questionAnswer})`, fontSize: 14, margin: [answer.indent, 0, 0, 0],
    })
    ctx.push({
      text: `${answer.selectedOption}`, fontSize: 14, margin: [answer.indent + 16, 4, 0, 4],
    })
  })

  window.pdfMake.createPdf({ content: ctx }).download(name)
}

import { useContext, useEffect, useState } from 'react'
import { CountDownContainer, Separator } from './styles'
import { differenceInSeconds } from 'date-fns'
import { CyclesContext } from '../..'

export function Countdown() {
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)
  const { activeCycle, activeCycleId, markCurrentCycleAsFinished } =
    useContext(CyclesContext)
  // Como o forms é em minuto precisamos manusear em segundos no count
  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0

  useEffect(() => {
    // Fazemos isso para poder limpar o ultimo intervalo caso eu chame um outro durante o countdown
    let interval: number

    if (activeCycle) {
      interval = setInterval(() => {
        const secondsDifference = differenceInSeconds(
          new Date(),
          activeCycle.startDate,
        )
        if (secondsDifference >= totalSeconds) {
          // Aqui é quando o ciclo acabou
          markCurrentCycleAsFinished()
          clearInterval(interval)
        } else {
          // Se o total de segundos não passou, então eu continuo contabilizando
          setAmountSecondsPassed(secondsDifference)
        }
      }, 1000)
    }

    return () => {
      clearInterval(interval)
    }
  }, [activeCycle, totalSeconds, activeCycleId, markCurrentCycleAsFinished])

  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0
  // Vamos transformar o segundos em minutos arredondando para baixo o que vem após a virgula
  const minutesAmount = Math.floor(currentSeconds / 60)
  // Agora vamos fazer a conta para saber o RESTO da divisão a cima
  const secondsAmount = currentSeconds % 60

  // Como no return eu tenho duas casas decimais, eu preciso que o numero também sempre tenha
  const minutes = String(minutesAmount).padStart(2, '0')
  const seconds = String(secondsAmount).padStart(2, '0')

  useEffect(() => {
    if (activeCycle) {
      document.title = `${minutes}:${seconds}`
    }
  }, [minutes, seconds, activeCycle])

  return (
    <CountDownContainer>
      <span>{minutes[0]}</span>
      <span>{minutes[1]}</span>
      <Separator>:</Separator>
      <span>{seconds[0]}</span>
      <span>{seconds[1]}</span>
    </CountDownContainer>
  )
}

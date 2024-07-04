import { HandPalm, Play } from 'phosphor-react'
import { useEffect, useState } from 'react'
import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from './styles'
import { NewCycleForm } from './components/NewCycleForm'
import { Countdown } from './components/Countdown'

interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptedDate?: Date
  finishedDate?: Date
}

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  function handleCreateNewCycle(data: NewCycleFormData) {
    // Deixo o ID separado pois eu vou usar pro activeCycleId
    const id = String(new Date().getTime())
    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }
    // Como eu dependendo do meu valor antigo, é interessante criar estado em formato de função
    setCycles((state) => [...state, newCycle])
    setActiveCycleId(id)
    setAmountSecondsPassed(0)
    reset()
  }

  function handleInterruptCycle() {
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, interruptedDate: new Date() }
        } else {
          return cycle
        }
      }),
    )
    setActiveCycleId(null)
  }

  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0
  // Vamos transformar o segundos em minutos arredondando para baixo o que vem após a virgula
  const minutesAmount = Math.floor(currentSeconds / 60)
  // Agora vamos fazer a conta para saber o RESTO da divisão a cima
  const secondsAmount = currentSeconds % 60

  // Como no return eu tenho duas casas decimais, eu preciso que o numero também sempre tenha
  const minutes = String(minutesAmount).padStart(2, '0')
  const seconds = String(secondsAmount).padStart(2, '0')

  console.log(cycles)

  useEffect(() => {
    if (activeCycle) {
      document.title = `${minutes}:${seconds}`
    }
  }, [minutes, seconds, activeCycle])

  // Observando o campo de task em tempo real
  const task = watch('task')
  const isSubmitDisabled = !task

  return (
    <HomeContainer>
      <form action="" onSubmit={handleSubmit(handleCreateNewCycle)}>
        <NewCycleForm activeCycle={activeCycle} />
        <Countdown activeCycle={activeCycle} />
        {activeCycle ? (
          <StopCountdownButton onClick={handleInterruptCycle} type="button">
            <HandPalm size={24} />
            Interromper
          </StopCountdownButton>
        ) : (
          <StartCountdownButton disabled={isSubmitDisabled} type="submit">
            <Play size={24} />
            Começar
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  )
}

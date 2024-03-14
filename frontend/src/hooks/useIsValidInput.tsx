import { useState } from 'react'

const useIsValidInput = (minChars: number, maxChars: number, initialValue = ""): [boolean, string, (eventInput: string) => void] => {
  const [input, setInput] = useState<string>(initialValue)
  const [isInputValid, setIsInputValid] = useState<boolean>(true)

  const handleSetInput = (input: string, eventInput: string) => {
    if (eventInput.length < minChars) {
      setIsInputValid(false)
      return input
    }
    if (eventInput.length > maxChars) {
      setIsInputValid(false)
      return input
    }
    setIsInputValid(true)
    return eventInput
  }

  const handleChange = (eventInput: string) => {
    setInput(input => handleSetInput(input, eventInput))
  }
  return [isInputValid, input, handleChange]
}

export default useIsValidInput
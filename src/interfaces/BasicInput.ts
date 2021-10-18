/**
 * This is the most basic form of an input
 */

export interface BasicInput {
  // Should user be warned that the input is wrong ?
  shouldWarn: boolean
  // Is the input valid
  isValid: boolean
  // Input's value
  value: string
}

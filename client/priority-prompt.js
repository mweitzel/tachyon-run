var Prompt = require('./prompt')

module.exports = PriorityPrompt

function PriorityPrompt(core, text, submit, cancel) {
  var prompt = new Prompt(
    text
  , submit
  , cancel
  , function always() { core.removePriorityObj(prompt) }
   )
  core.priorityStack.push(prompt)
  return prompt
}

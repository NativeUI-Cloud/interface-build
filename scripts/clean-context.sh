jq '
  if .["app-prototyping-agent: edit-app-agent"] then
    .["app-prototyping-agent: edit-app-agent"] |= map(
      select((.content[]?.text? // "") | startswith("I see this error with the app, reported by NextJS") | not)
    )
  else
    .
  end
' /home/user/.idx/ai/capra-context-state.json > /home/user/.idx/ai/temp-context.json && \
mv /home/user/.idx/ai/temp-context.json /home/user/.idx/ai/capra-context-state.json
type XmlContent = string | Xml | XmlContent[]

type Xml = {
  [key: string]: XmlContent
}

/**
 * Recursively converts an XML string to a JSON object using regexp.
 * It only extracts the data from xml so you can parse it yourself.
 * DOES NOT SUPPORTS ATTRIBUTES!
 * @param {string} xml The XML string to convert.
 * @return {Xml} The JSON object representing the XML.
 */
export function xml2json(xml: string): Xml {
  const rx =
    // deno-lint-ignore no-invalid-regexp
    /<(?<tag>[a-zA-Z0-9]+).*?>(?<content>[\s\S]*?)<\/\k<tag>>|<(?<tag>[a-zA-Z0-9]+).*?\/>(?<content>)/g
  // const rx = new RegExp( // alternative to lint above
  //   '<(?<tag>[a-zA-Z0-9]+).*?>(?<content>[\\s\\S]*?)<\\/\\k<tag>>|<(?<tag>[a-zA-Z0-9]+).*?\\/>(?<content>)'.toString(),
  //   'g'
  // )

  const json: Xml = {}
  let groups: { [key: string]: string } | undefined

  while ((groups = rx.exec(xml)?.groups)) {
    const { tag, content } = groups
    const value = new RegExp(rx).test(content) ? xml2json(content) : content
    if (json[tag]) {
      if (!Array.isArray(json[tag])) json[tag] = [json[tag]]
      json[tag].push(value)
    } else {
      json[tag] = value
    }
  }

  return json
}

/* Regular expression explanation:
<(?<tag>[a-zA-Z0-9]+)      # Match the opening tag name and capture it as 'tag'
.*?                        # Lazily match any characters between the opening tag and '>', like properties
>                          # Match the closing '>' of the opening tag
(?<content>[\s\S]*?)       # Lazily match content inside the tag, capture it as 'content'
<\/\k<tag>>                # Match the closing tag that corresponds to the opening tag (backreference to 'tag')

|                          # OR (alternative match for self-closing tags)

<(?<tag>[a-zA-Z0-9]+)      # Match the tag name again for self-closing tags, captured as 'tag'
.*?                        # Lazily match any characters before the self-closing '/'
\\/>                       # Match the '/>' of the self-closing tag
(?<content>)               # Capture empty content (since it's self-closing)
`,
'g'                        // Global flag to match all occurrences
*/

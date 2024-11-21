import { expect, test } from "bun:test"
import { xml2json } from "./xml2json.ts"

const xml = `<ListBucketResult xmlns="http://doc.s3.amazonaws.com/2006-03-01">
  <Name>0-9</Name>
  <Prefix/>
  <Marker/>
  <IsTruncated>false</IsTruncated>
  <Contents>
    <Key>app.tar.gz</Key>
    <Generation>1724807049490831</Generation>
    <MetaGeneration>1</MetaGeneration>
    <LastModified>2024-08-28T01:04:09.525Z</LastModified>
    <ETag>&quot;8ec81ee4b020e4c4d17d0d902408e362&quot;</ETag>
    <Size>280729</Size>
  </Contents>
  <Contents>
    <Key>aweosme.html</Key>
    <Generation>1719070751186225</Generation>
    <MetaGeneration>1</MetaGeneration>
    <LastModified>2024-06-22T15:39:11.232Z</LastModified>
    <ETag>&quot;d41d8cd98f00b204e9800998ecf8427e&quot;</ETag>
    <Size>0</Size>
  </Contents>
`

test("xml2json", () => {
  const json = xml2json(xml)
  const expected = {
    "Name": "0-9",
    "Prefix": "",
    "Marker": "",
    "IsTruncated": "false",
    "Contents": [
      {
        "Key": "app.tar.gz",
        "Generation": "1724807049490831",
        "MetaGeneration": "1",
        "LastModified": "2024-08-28T01:04:09.525Z",
        "ETag": "&quot;8ec81ee4b020e4c4d17d0d902408e362&quot;",
        "Size": "280729",
      },
      {
        "Key": "aweosme.html",
        "Generation": "1719070751186225",
        "MetaGeneration": "1",
        "LastModified": "2024-06-22T15:39:11.232Z",
        "ETag": "&quot;d41d8cd98f00b204e9800998ecf8427e&quot;",
        "Size": "0",
      },
    ],
  }
  expect(json).toEqual(expected)
})

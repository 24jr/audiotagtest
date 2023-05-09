import { error, json } from "@sveltejs/kit"
import NodeID3 from "node-id3"

export async function POST(event) {
  console.log("start set tags")
  const body = await event.request.formData()
  const tags = body.get("tags")
  const file = body.get("file")
  if (!file || !tags) {
    return new Response("File or tags missing", { status: 400 })
  }
  console.log([...body])
  const buffer = await file.arrayBuffer()
  const fileBuffer = Buffer.from(buffer)
  const updatedAudioBuffer = NodeID3.write(tags, fileBuffer)
  // const updatedAudioBuffer = NodeID3.update(tags, filebuffer)
  console.log("updatedAudioBuffer", updatedAudioBuffer)
  // const updatedTags = NodeID3.read(updatedAudioBuffer)
  // console.log("updatedTags:", updatedTags)
  console.log(NodeID3.read(updatedAudioBuffer))
  if (updatedAudioBuffer) {
    return new Response(updatedAudioBuffer, {
      status: 200,
      headers: { "Content-Type": "audio/mpeg" },
    })
  } else {
    return new Response("Error updating tags", { status: 500 })
  }
}

<script>
  let file
  let newAudioSrc
  const tags = {
    title: "Test Title",
    artist: "Test Artist",
    album: "Test Album",
    image: {
      mime: "image/jpeg",
      type: {
        id: 3, // Front cover
      },
      description: "image description",
      imageBuffer: null,
    },
  }

  const public_audio_url =
    "https://firmcmccxfdethzdexal.supabase.co/storage/v1/object/public/site/test/helloworld.mp3"
  async function setAudioTagsToUrl() {
    const file = await urlToFile(public_audio_url, "puburltest.mp3")
    setAudioTags(file, tags)
  }

  async function urlToFile(url, filename) {
    const response = await fetch(url)
    const data = await response.blob()
    return new File([data], filename, { type: data.type })
  }

  async function setAudioTags(file, tags) {
    try {
      const formData = new FormData()
      formData.append("file", file)
      // add image cover
      const responseImage = await fetch(
        "https://firmcmccxfdethzdexal.supabase.co/storage/v1/object/public/site/test/moonsm.jpeg"
      )
      const imageArrayBuffer = await responseImage.arrayBuffer()
      tags.image.imageBuffer = new Uint8Array(imageArrayBuffer)
      console.log("pretags", tags)
      formData.append("tags", JSON.stringify(tags))
      const response = await fetch("/api/v1/audio", {
        method: "POST",
        body: formData,
      })
      if (!response.ok) {
        throw new Error(await response.text())
      }
      const updatedAudioBlob = await response.blob()
      newAudioSrc = URL.createObjectURL(updatedAudioBlob)
    } catch (err) {
      console.error(err)
    }
  }

  function downloadAudio() {
    const link = document.createElement("a")
    link.href = newAudioSrc
    link.download = `${tags.title || "new_audio"}.mp3`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
</script>

<div style="margin: 1rem;">
  <input
    type="file"
    accept="audio/*"
    on:change={(event) => (file = event.target.files[0])}
  />
  <br />
  <br />
  <button on:click={() => setAudioTags(file, tags)}
    >set tags to input file</button
  >
  <button on:click={() => setAudioTagsToUrl()}>set tags to public url</button>
  <p>og audio</p>
  {#if file}
    <audio controls preload="metadata">
      <source src={URL.createObjectURL(file)} type="audio/mpeg" />
    </audio>
  {/if}

  <p>new audio</p>
  {#if newAudioSrc}
    <audio controls preload="metadata">
      <source src={newAudioSrc} type="audio/mpeg" />
    </audio>
  {/if}
  <button on:click={() => downloadAudio()}>download new audio</button>
</div>

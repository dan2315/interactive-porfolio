import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { loadWithProgress, createBlobURL } from './assetLoader'

const gltfLoader = new GLTFLoader()

const cache = new Map()

export async function loadGLTF(url, contentLength, onProgress) {
  if (cache.has(url) && cache.get(url).gltf) {
    const entry = cache.get(url)
    return entry.gltf
  }

  if (cache.has(url)) {
    return cache.get(url).promise
  }

  let resolve, reject

  const promise = new Promise((res, rej) => {
    resolve = res
    reject = rej
  })

  cache.set(url, { promise })

  try {
    const data = await loadWithProgress(url, contentLength, onProgress)
    const blobURL = createBlobURL(data, 'model/gltf-binary')

    gltfLoader.load(
      blobURL,
      (gltf) => {
        cache.set(url, { promise, gltf, blobURL })
        resolve(gltf)
      },
      undefined,
      (err) => {
        URL.revokeObjectURL(blobURL)
        cache.delete(url)
        reject(err)
      }
    )
  } catch (err) {
    cache.delete(url)
    reject(err)
  }

  return promise
}

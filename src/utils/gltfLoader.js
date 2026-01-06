import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { loadWithProgress, createBlobURL } from './assetLoader'

const gltfLoader = new GLTFLoader()

export async function loadGLTF(url, contentLength, onProgress) {
  const data = await loadWithProgress(url, contentLength, onProgress)
  const blobURL = createBlobURL(data, 'model/gltf-binary')

  return new Promise((resolve, reject) => {
    gltfLoader.load(
      blobURL,
      (gltf) => {
        URL.revokeObjectURL(blobURL)
        resolve(gltf)
      },
      undefined,
      (err) => {
        URL.revokeObjectURL(blobURL)
        reject(err)
      }
    )
  })
}
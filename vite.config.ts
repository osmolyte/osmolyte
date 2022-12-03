import { readdirSync, readFileSync } from 'fs'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

function collectValidators(src) {
  const matches = src.match(/export const [a-z]+ = {/g)
  for (const m in matches) {
    const cityId: string = matches[m].split(' ')[2]
    const files: string[] = readdirSync(`src/config/${cityId}/`)

    const validators: string[] = [];
    for (const f in files) {
      const validatorId: string = files[f].replace('.json', '')
      const validatorData: string = readFileSync(`src/config/${cityId}/${files[f]}`).toString()
      validators.push(`${validatorId}: ${validatorData}`)
    }

    src = src.replace(matches[m], matches[m] + 'validators:{' + validators.join(',') + '},')
  }
  return src
}

function enrichCitiesConfig() {
  return {
    name: 'enrich-cities-config',
    transform(src, id) {
      if (/cities\.json$/.test(id)) {
        return {
          code: collectValidators(src),
          map: null
        }
      }
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    devSourcemap: true,
  },
  plugins: [
      vue(),
      enrichCitiesConfig()
  ]
})

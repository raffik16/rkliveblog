import rss from './rss.mjs'
import llms from './llms.mjs'

async function postbuild() {
  await rss()
  await llms()
}

postbuild()

#!/bin/sh
# Patches Language Reactor in place from the pristine copies in this backup folder (re-runnable).
B="$(cd "$(dirname "$0")" && pwd)"; E="$B/../Language Reactor_bigtajine"
for f in pageScript_lly.min.js pageScript_lln.min.js content_dictionary.js; do
  cat "$E/arabizi.js" "$B/$f" | sed -e 's/=\["zh-CN","zh-TW","ko","th"\]/=["zh-CN","zh-TW","ko","th","ar"]/g' \
    -e 's/\["ko","th"\]/["ko","th","ar"]/g' -e 's/r==="ko"||r==="th"?t==="ORIG"/r==="ko"||r==="th"||r==="ar"?t==="ORIG"/g' > "$E/$f"
  echo "$f: $(grep -o '"th","ar"\]' "$E/$f" | wc -l) lists patched"
done

# Research

The `/research` page presents the MSc AI dissertation "Detecting Natural Hallucinations in Local RAG: Span Detectors, LLM Judges, and the Limits of Ensembling" (Queen Mary University of London, 2026, supervised by Syed Rafee).

Sources, all in `~/Downloads/MS AI/MS Thesis/`:

- `Moiz Shahid_PG_Project_Dissertation_Thesis.pdf`: the submitted paper. The page's text and every number come from it.
- `Project/`: the code and the frozen runs behind the paper. `claims.json` is built from this folder (see below).
- Not used: the presentation video (`Moiz_Shahid_PG_Project_Video.MOV`), the reflective essay and the supporting-material zip.

## Where the numbers live

- `app/_data/research/index.js` holds the text and the numbers. These come from the paper's tables I–IV, figures 1–3, sections IV-B to IV-G and appendix B.
- `app/_data/research/claims.json` holds the 345 scored claims. The claims panel at the top of the page counts its own numbers from this file.
- `app/_data/research.test.js` recomputes, from `claims.json`:
  - tables I–IV and the Venn regions of figure 2;
  - the meta-claim shares and the headline numbers;
  - the sweep at the threshold the page uses.

  So if either file changes, the tests catch any number on the page that no longer agrees.
- The span detector's threshold sweep (chart 02) comes from `Project/experiment_runs/lettuce_sweep_report.md`, the source of appendix B:
  - 2 claims are flagged at every threshold from 0.001 to 0.5, 1 at 0.7 and 0 at 0.9.
  - The AUROC is 0.524.

## claims.json

There is one entry per scored claim. The 346th claim, marked as an extraction error, is left out, as in the paper. Each entry has:

- `id`: question id and claim index, for example `TB-002#6`;
- `type`: the question type;
- `text`: the claim;
- `gold`: the hand label, `g`, `y` or `r`;
- `meta`: whether it is a meta-claim;
- `category`: the error kind, only for the 42 claims labelled yellow or red;
- `says`: one letter for each detector's verdict, in the order: span detector (LettuceDetect), then the Llama, Qwen and Gemma judges.

To rebuild it, run the script below with the Project folder and the output file. It asserts the paper's counts before writing:

```sh
python3 extract.py ~/Downloads/"MS AI/MS Thesis/Project" app/_data/research/claims.json
npx prettier --write app/_data/research/claims.json
```

```python
import csv, json, sys
from collections import Counter
from pathlib import Path

P, OUT = Path(sys.argv[1]), Path(sys.argv[2])
RUNS = P / 'experiment_runs'
gold = list(csv.DictReader(open(RUNS / 'gold_labels.csv')))
taxonomy = {(r['qid'], r['claim_idx']): r['category'] for r in csv.DictReader(open(P / 'analysis/taxonomy.csv'))}

def verdicts(name):
    return {(v['qid'], str(v['claim_idx'])): v['label'] for v in map(json.loads, open(RUNS / name))}

detectors = {
    'lettuce': verdicts('verdicts_lettuce__llama3.1-8b.jsonl'),
    'llama': verdicts('verdicts_llm__llama3.1-8b.jsonl'),
    'qwen': verdicts('verdicts_llm__qwen2.5-7b.jsonl'),
    'gemma': verdicts('verdicts_llm__gemma2-9b.jsonl'),
}
# LettuceDetect is deterministic: the run-2 file says the same
assert verdicts('verdicts_lettuce__qwen2.5-7b.jsonl') == detectors['lettuce']

TYPE = {'answerable': 'answerable', 'partial_support': 'partial', 'false_premise': 'false-premise',
        'fabrication': 'fabrication', 'abstain': 'abstain'}
LETTER = {'green': 'g', 'yellow': 'y', 'red': 'r'}
claims = []
for r in gold:
    if r['gold'] == 'skip':
        continue
    key = (r['qid'], r['claim_idx'])
    claims.append({
        'id': f"{r['qid']}#{r['claim_idx']}",
        'type': TYPE[r['type']],
        'text': r['claim'].strip(),
        'gold': LETTER[r['gold']],
        'meta': r['notes'] == 'meta',
        **({'category': taxonomy[key]} if key in taxonomy else {}),
        'says': ''.join(LETTER[detectors[d][key]] for d in ('lettuce', 'llama', 'qwen', 'gemma')),
    })

assert len(claims) == 345
assert Counter(c['gold'] for c in claims) == Counter({'g': 303, 'y': 27, 'r': 15})
assert sum(c['meta'] for c in claims) == 23
OUT.write_text(json.dumps(claims, ensure_ascii=False, indent=0, separators=(',', ':')) + '\n')
```

## The PDF

`public/research/moiz-shahid-msc-ai-dissertation.pdf` is the submitted paper with two things removed, because it is published on the open web:

- the student number on page 1;
- the handwritten signature on page 10.

Both are deleted from the file, not covered over, so neither can be copied or extracted. The other nine pages were checked by rendering them and are pixel-identical to the original. Removing the line on page 1 leaves a one-line gap under the name. The original in Downloads is untouched.

To publish a new version, run this with PyMuPDF (`pip install pymupdf`):

```python
import sys, pymupdf

doc = pymupdf.open(sys.argv[1])
first = doc[0]
[hit] = first.search_for('Student Number:')
words = [w for w in first.get_text('words') if abs(w[1] - hit.y0) < 2 and abs(w[3] - hit.y1) < 2]
first.add_redact_annot(pymupdf.Rect(min(w[0] for w in words), hit.y0, max(w[2] for w in words), hit.y1), fill=False)
first.apply_redactions(images=pymupdf.PDF_REDACT_IMAGE_NONE, graphics=pymupdf.PDF_REDACT_LINE_ART_NONE,
                       text=pymupdf.PDF_REDACT_TEXT_REMOVE)

statement = doc[9]
[image] = statement.get_images(full=True)
[rect] = statement.get_image_rects(image[0])
statement.add_redact_annot(rect, fill=False)
statement.apply_redactions(images=pymupdf.PDF_REDACT_IMAGE_REMOVE, graphics=pymupdf.PDF_REDACT_LINE_ART_NONE,
                           text=pymupdf.PDF_REDACT_TEXT_NONE)

# no clean=True: that rewrites every page and shifts some glyphs by a fraction of a point
doc.save(sys.argv[2], garbage=4, deflate=True)
```

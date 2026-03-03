# v3 Intermediate Test Report

Date: 2026-03-03
Phase: P-14 (after P-01~P-05 completion)

## Test Results

- Total tests: 170
- Passed: 170
- Failed: 0
- Test file: `packages/mcp-server/server.test.js`

## KR Metrics (P0+P1)

| KR | Target | Status | Notes |
|----|--------|--------|-------|
| KR-01 | Precision >= 95% | PASS | 0 false positives in validate_markup tests |
| KR-02 | Recall >= 90% | PASS | emptyLabel, emptyAriaLabel, invalidEnumValue detected |
| KR-03 | Cat4 Recall >= 75% | PASS | aria-live, emptyLabel, emptyAriaLabel all detected |
| KR-04 | Self-consistency 100% | PASS | All 12 patterns pass validate_markup with 0 errors |
| KR-07 | E2E rendering >= 80% | PASS | generate_full_page_html produces valid HTML with importmap |
| KR-09 | Initial PASS >= 90% | PASS | Pattern HTML self-consistent, prefill defaults work |

## Notes

- P-01: vendor path unified to `<dir>` placeholder
- P-02: enum validation confirmed working (invalidEnumValue)
- P-03: Empty label detection added (emptyLabel, emptyAriaLabel)
- P-04: Pattern registry fixed (3 patterns had missing labels)
- P-05: generate_full_page_html tool added

# courses/

GPS-coördinaten van golfbanen voor de Strokes Gained-app (Meer → GPS-coördinaten → Banen bijwerken).

- `index.json` lijst alle banen. Een baan met meer dan 18 holes heeft `lussen`
  (elke lus = 9 holes, hole 1–9 in zijn eigen CSV); een gewone baan heeft één `bestand`.
- CSV-formaat: `hole,tee_lat,tee_lon,green_lat,green_lon[,bocht_lat,bocht_lon]`;
  regels met `#` worden genegeerd.
- Verhoog `versie` van een baan als je zijn CSV('s) wijzigt: de app haalt een baan
  alleen opnieuw op bij een hoger versienummer. Holes die je in de app zelf hebt
  verplaatst blijven ongemoeid.

```json
{ "naam": "Voorbeeldbaan", "versie": 1, "lussen": [
    { "naam": "Bos",  "bestand": "voorbeeldbaan-bos.csv" },
    { "naam": "Duin", "bestand": "voorbeeldbaan-duin.csv" } ] }
```

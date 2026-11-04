# HERA RENTAL — νέο website (animated showroom)

Στατικό site (HTML/CSS/JS, χωρίς build). Animations με GSAP + ScrollTrigger (cdnjs).

## Τοπική προβολή
```
python3 -m http.server 8000
# άνοιξε http://localhost:8000
```

## Δομή
- `index.html` — όλες οι ενότητες (hero, κράτηση, showroom, γιατί Hera, Hera Flex, κριτικές, επικοινωνία, footer)
- `css/style.css` — design tokens στην αρχή (`:root`)
- `js/main.js` — στόλος (`FLEET`), φόρμα κράτησης, animations
- `assets/` — logo και φωτογραφίες οχημάτων (από το τρέχον herarental.gr)

## Πριν το live
- **Φόρμα κράτησης:** όρισε `BOOKING_URL` στο `js/main.js` ώστε να στέλνει στη μηχανή κρατήσεων. Αν μείνει κενό, εμφανίζει σύνοψη με κουμπιά email / κλήσης.
- **Στοιχεία οχημάτων:** τα specs (θέσεις, τύπος) και τα μοντέλα «ή παρόμοιο» στο `FLEET` είναι ενδεικτικά, επιβεβαίωσε με τον πελάτη.
- **Όροι μίσθωσης:** τα links στο footer δείχνουν προς το τρέχον site.

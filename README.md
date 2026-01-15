Sistem de Gestiune Catalog Supereroi
Acest proiect a fost dezvoltat în cadrul Universității Naționale de Știință și Tehnologie Politehnica București de către Cocor Erwin Gilbert Mario și Fronea Gabriel din grupa 444B.

Descrierea generală a proiectului
Proiectul reprezintă o soluție Full-Stack modernă destinată vizualizării și administrării unei baze de date complexe care conține peste 500 de înregistrări. Obiectivul principal a fost crearea unei platforme capabile să gestioneze eficient volume mari de date fără a compromite performanța interfeței utilizator.

Aplicația este construită pe o arhitectură decuplată, compusă din Frontend și Backend, oferind două fluxuri principale:
- Modulul Catalog: O interfață de tip grid unde utilizatorii pot explora eroii folosind paginarea, filtrarea dinamică pe universuri și căutarea globală în timp real.
- Modulul Administrativ: Un tablou de bord protejat prin autentificare, unde administratorul poate executa fluxul complet CRUD: crearea de noi eroi, actualizarea detaliilor existente și eliminarea înregistrărilor.

Tehnologii utilizate
- Frontend (Interfața Utilizator)
- React.js: Utilizat pentru construirea componentelor UI reutilizabile și gestionarea stării aplicației prin Hook-uri precum useState și useEffect.
- React Router Dom: Implementat pentru gestionarea rutelor dinamice (Catalog, Detalii, Login, Admin) și protejarea paginilor administrative.
- Axios: Biblioteca utilizată pentru efectuarea cererilor HTTP către API-ul Backend și gestionarea parametrilor de filtrare.

Backend (Logica de Server)
- Node.js & Express.js: Serverul gestionează rutele API și procesează datele înainte de a le trimite către client.
- Middleware CORS & Body-Parser: Configurate pentru a permite comunicarea între domenii diferite și pentru a procesa obiecte JSON de până la 50MB, necesare pentru imaginile în format Base64.

Baza de Date
- MySQL: S-a utilizat un model de stocare hibrid unde metadatele fixe au ID-uri indexate, iar restul atributelor sunt stocate într-o coloană de tip LONGTEXT în format JSON pentru o flexibilitate sporită.

Structura datelor
Fiecare supererou este reprezentat printr-un obiect JSON complex stocat în coloana data, respectând următoarea ierarhie:
- name: Numele de identitate al eroului.
- image: Reprezentare vizuală sub formă de String format Base64.
- powerstats: Atribute de performanță precum Intelligence, Strength, Speed și Durability.
- biography: Date de context incluzând Full-name, Publisher și Place-of-birth.
- appearance: Caracteristici fizice precum Gender, Race, Height și Weight.

Utilizarea inteligenței artificiale
- Integrarea inteligenței artificiale a fost un factor determinant în accelerarea dezvoltării, fiind utilizată în trei direcții strategice:
- Rezolvarea erorilor de context: AI-ul a identificat și corectat erori structurale, cum ar fi lipsa contextului de ruter (BrowserRouter) care împiedica funcționarea navigării.
- Optimizarea Fluxului de Date: La recomandarea AI-ului, s-a trecut de la filtrarea locală pe Frontend la filtrarea globală pe Backend pentru a permite căutarea în toate cele 500+ înregistrări fără a bloca memoria browserului.
- Generarea de Interfețe: AI-ul a asistat la crearea formularului complex de adăugare și editare care respectă structura imbricată a obiectelor din baza de date.

Concluzii și Rezolvări Tehnice
- Proiectul a abordat provocări specifice gestionării volumului mare de date stocate sub formă de imagini codificate.
- Performanța: Pentru a evita erorile de tip "Out of Memory" cauzate de încărcarea simultană a setului de date, s-a implementat paginarea la nivel de server, limitând afișarea la maximum 20 de eroi pe pagină.
- Motorul de căutare: Căutarea a fost extinsă de la nivel local la nivel global, executând interogări de tip LIKE în toată baza de date prin intermediul serverului.
- Filtrarea dinamică: Pentru a evita omiterea universurilor noi, s-a dezvoltat o rută API care extrage automat toate valorile unice din baza de date pentru a popula dropdown-ul de filtrare.

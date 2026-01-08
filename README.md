# Dokumentation Portfolio Website

### **IDEE & DESIGN<br>**
Die Idee meiner Portfolio-Website war es, eine ruhige, minimalistische Plattform zu gestalten, auf der der Fokus klar auf dem Inhalt und den Arbeiten liegt. Mir war wichtig, mich bewusst von überladenen oder stark animierten Portfolio-Websites abzugrenzen und stattdessen ein reduziertes Design zu entwickeln, das Raum zum Entdecken lässt.<br>

Das visuelle Konzept basiert auf einem dunklen Hintergrund, klarer Typografie und grosszügigen Abständen. Farben, Animationen und Interaktionen wurden bewusst sparsam eingesetzt, um den Arbeiten nicht die Aufmerksamkeit zu nehmen. Die Website soll sich ruhig, aufgeräumt und konzentriert anfühlen.<br>

Ein zentrales Gestaltungselement ist das Project Overlay, welches als Einstieg in die Website dient. Statt direkt alle Projekte zu zeigen, werden Nutzer:innen zuerst durch eine kuratierte Übersicht geführt. Der About-Me-Bereich ist als eigenes Overlay umgesetzt, um ihn klar vom Portfolio zu trennen und ihm einen eigenen Raum zu geben.<br>

Ein weiterer wichtiger gestalterischer und konzeptioneller Entscheid war die Nutzerfreundlichkeit auf mobilen Geräten. Da das Durchstöbern von Arbeiten auf dem Smartphone sehr unterschiedlich stattfinden kann, habe ich mich bewusst dafür entschieden, zwei Ansichten anzubieten: eine vertikale und eine horizontale View. Die vertikale Ansicht eignet sich besonders gut zum ruhigen Durchstöbern einzelner Projekte, während die horizontale Ansicht eine schnelle und kompakte Übersicht über alle Arbeiten ermöglicht. So können Nutzer:innen je nach Situation selbst entscheiden, wie sie die Inhalte konsumieren möchten.


### **SETUP & UMSETZUNG<br>**
Die Website wurde mit HTML, CSS und Vanilla JavaScript umgesetzt. Auf Frameworks habe ich bewusst verzichtet, um die Struktur und Funktionsweise der Website vollständig zu verstehen und kontrollieren zu können.<br>

Die Projekte werden dynamisch über JSON-Dateien geladen. Dadurch ist die Seite modular aufgebaut und neue Projekte lassen sich einfach ergänzen, ohne den HTML-Code anpassen zu müssen. Bilder und Videos sind projektweise strukturiert organisiert.<br>

Technisch besteht die Website aus mehreren klaren Zuständen:<br>
– Project Overlay (Startansicht)<br>
– Portfolio-Ansicht<br>
– About-Me Overlay<br>
– Footer-Overlays für Datenschutz und Impressum<br>

Ich habe mich bewusst gegen klassische Subpages entschieden und stattdessen mit Overlays und Zuständen gearbeitet. Dieser Entscheid dient der Klarheit und Einfachheit der Website, da Nutzer:innen jederzeit auf derselben Seite bleiben und nicht zwischen verschiedenen Unterseiten navigieren müssen. Dadurch bleibt die Struktur übersichtlich, die Bedienung intuitiv und der Fokus konsequent auf den Inhalten.

Ein animierter Preloader sorgt für einen ruhigen Einstieg. Im Project Overlay wird ein Hintergrundvideo verwendet, das für Mobile und Desktop separat vorbereitet wird, um Performance und Format optimal zu steuern.
Die Entwicklung erfolgte lokal in Visual Studio Code, der Upload auf den Webserver über SFTP.


### **SCHWIERIGKEITEN & HERAUSFORDERUNGEN<br>**
Ein grosser Teil des Projekts bestand aus Fehlersuche, Debugging und Wiederherstellung.

Die grösste Herausforderung war ein technisches Problem mit Visual Studio Code in Kombination mit SFTP und Dateizugriffsrechten. In diesem Prozess konnte mein Projekt zeitweise nicht mehr korrekt geöffnet oder gelesen werden, wodurch beinahe alle Dateien verloren gegangen wären.

Mit Hilfe von ChatGPT und anhand unseres bisherigen Verlaufs konnte ich die Website jedoch Schritt für Schritt beinahe zum aktuellen Stand wiederherstellen. Dieser Prozess war zeitintensiv, frustrierend und emotional belastend, aber gleichzeitig extrem lehrreich.<br>
Weitere Herausforderungen:<br>
– Komplexes Scroll-Verhalten bei mehreren Overlays<br>
– Saubere Trennung zwischen Body-Scroll und Overlay-Scroll<br>
– Unterschiedliches Verhalten auf Mobile und Desktop<br>
– Exakte Kontrolle von Abständen zwischen Header, Content und Footer<br>
– Umsetzung einer horizontalen und vertikalen Projektansicht auf Mobile<br>
– Zentrierung von Texten und Buttons über alle Viewports hinweg<br>

Gerade bei einem bewusst reduzierten Design erwiesen sich kleine Details als technisch anspruchsvoll.


### **KNOWN BUGS<br>**
Zum aktuellen Stand sind folgende Bugs bekannt:
In der mobilen Version bei horizontaler View rutscht die Seite leicht nach unten, wenn man ganz nach oben zieht (Overscroll-Verhalten). Dieser Effekt beeinträchtigt die Nutzung nur wenig, ich möchte dies aber in einer weiteren Überarbeitung genauer analysieren und verbessern.

Ein weiterer Bug betrifft die geloopten Hintergrundvideos im Project-Overlay, welche derzeit nicht angezeigt werden. Trotz verschiedener Lösungsansätze konnte ich dieses Problem nicht beheben. Unter anderem habe ich versucht, die Videodateien zu komprimieren bzw. in ihrer Dateigrösse zu reduzieren, was jedoch keinen Einfluss auf das Verhalten hatte. Auffällig war zudem, dass die entsprechenden Videodateien im Web-FTP nicht im vorgesehenen Ordner auffindbar waren, obwohl sie lokal im Projekt (VS Code) korrekt eingebunden sind.
Ein manueller Upload der Videos direkt über das Web-FTP schlug ebenfalls fehl, da hierbei wiederholt eine Fehlermeldung angezeigt wurde und der Upload nicht abgeschlossen werden konnte. Trotz intensiver Fehlersuche und mehrerer Versuche konnte ich keine funktionierende Lösung finden. Der Bug wurde daher bewusst dokumentiert und für eine zukünftige Weiterentwicklung vorgesehen.
Aus gestalterischer Sicht ist dies besonders schade, da das Hintergrundvideo ursprünglich als zentrales visuelles Element im Project-Overlay konzipiert war und eines der gestalterischen Highlights der ansonsten bewusst sehr schlicht gehaltenen Website darstellen sollte. Das Problem möchte ich in einer künftigen Weiterentwicklung der Website definitiv noch beheben, für die Abgabe reichte die Zeit jedoch leider nicht mehr.


### **LEARNINGS<br>**
Dieses Projekt war eines der lehrrreichsten Web-Projekte, an denen ich bisher gearbeitet habe.

Meine wichtigsten Learnings:
– Besseres Verständnis für CSS, Overlays und Scroll-Logik
– Strukturierter Umgang mit komplexen Zuständen in JavaScript
– Systematisches Debugging statt unkontrolliertem Ausprobieren
– Die Erkenntnis, dass minimalistisches Design technisch sehr komplex sein kann
– Und vor allem: unbedingt jedes Mal Backups machen

Besonders prägend war die Erfahrung, beinahe den gesamten Code zu verlieren und ihn dennoch wiederherstellen zu können. Die Zusammenarbeit mit ChatGPT hat mir dabei geholfen, ruhig zu bleiben, strukturiert zu denken und Lösungen zu finden, anstatt in Panik zu geraten.

Dieses Projekt hat mir gezeigt, dass Durchhaltevermögen, sauberes Arbeiten und gutes Fehlermanagement genauso wichtig sind wie gestalterische Entscheidungen. Ich habe sehr viel Zeit in die Umsetzung investiert, hatte grosse Freude am Entwicklungsprozess und bin insgesamt sehr zufrieden mit dem Endergebnis meiner Portfolio-Website.


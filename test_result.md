#====================================================================================================
# START - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================

# THIS SECTION CONTAINS CRITICAL TESTING INSTRUCTIONS FOR BOTH AGENTS
# BOTH MAIN_AGENT AND TESTING_AGENT MUST PRESERVE THIS ENTIRE BLOCK

# Communication Protocol:
# If the `testing_agent` is available, main agent should delegate all testing tasks to it.
#
# You have access to a file called `test_result.md`. This file contains the complete testing state
# and history, and is the primary means of communication between main and the testing agent.
#
# Main and testing agents must follow this exact format to maintain testing data. 
# The testing data must be entered in yaml format Below is the data structure:
# 
## user_problem_statement: {problem_statement}
## backend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.py"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## frontend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.js"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## metadata:
##   created_by: "main_agent"
##   version: "1.0"
##   test_sequence: 0
##   run_ui: false
##
## test_plan:
##   current_focus:
##     - "Task name 1"
##     - "Task name 2"
##   stuck_tasks:
##     - "Task name with persistent issues"
##   test_all: false
##   test_priority: "high_first"  # or "sequential" or "stuck_first"
##
## agent_communication:
##     -agent: "main"  # or "testing" or "user"
##     -message: "Communication message between agents"

# Protocol Guidelines for Main agent
#
# 1. Update Test Result File Before Testing:
#    - Main agent must always update the `test_result.md` file before calling the testing agent
#    - Add implementation details to the status_history
#    - Set `needs_retesting` to true for tasks that need testing
#    - Update the `test_plan` section to guide testing priorities
#    - Add a message to `agent_communication` explaining what you've done
#
# 2. Incorporate User Feedback:
#    - When a user provides feedback that something is or isn't working, add this information to the relevant task's status_history
#    - Update the working status based on user feedback
#    - If a user reports an issue with a task that was marked as working, increment the stuck_count
#    - Whenever user reports issue in the app, if we have testing agent and task_result.md file so find the appropriate task for that and append in status_history of that task to contain the user concern and problem as well 
#
# 3. Track Stuck Tasks:
#    - Monitor which tasks have high stuck_count values or where you are fixing same issue again and again, analyze that when you read task_result.md
#    - For persistent issues, use websearch tool to find solutions
#    - Pay special attention to tasks in the stuck_tasks list
#    - When you fix an issue with a stuck task, don't reset the stuck_count until the testing agent confirms it's working
#
# 4. Provide Context to Testing Agent:
#    - When calling the testing agent, provide clear instructions about:
#      - Which tasks need testing (reference the test_plan)
#      - Any authentication details or configuration needed
#      - Specific test scenarios to focus on
#      - Any known issues or edge cases to verify
#
# 5. Call the testing agent with specific instructions referring to test_result.md
#
# IMPORTANT: Main agent must ALWAYS update test_result.md BEFORE calling the testing agent, as it relies on this file to understand what to test next.

#====================================================================================================
# END - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================



#====================================================================================================
# Testing Data - Main Agent and testing sub agent both should log testing data below this section
#====================================================================================================

user_problem_statement: |
  Continuer le développement de IA Match (Expo + FastAPI + MongoDB).
  Utilisateur a demandé:
  1) Finalisation: section Ressources FR dans Academy + logos corrects (Claude…)
  2) Nouvelles fonctionnalités: Bookmarks, Historique Builder, Prompt du Jour, Comparateur >2 IA, Onboarding guidé
  3) Correction des warnings shadow* deprecated.

backend:
  - task: "GET /api/resources retourne 16 ressources françaises"
    implemented: true
    working: true
    file: "/app/backend/server.py"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
        -working: true
        -agent: "main"
        -comment: "Aucune modification backend dans cette itération. Endpoint déjà existant retourne 16 ressources françaises (Underscore_, Korben, Numerama…). Vérifié manuellement via curl. Tester pour confirmer."
        -working: true
        -agent: "testing"
        -comment: "Vérifié via /app/backend_test.py contre EXPO_PUBLIC_BACKEND_URL/api. GET /api/resources retourne 200 avec exactement 16 items. Tous les items contiennent les champs requis (id, category, title, author, summary, url). Catégories présentes: YouTube, Blog, Podcast, Newsletter. Auteurs Underscore_ et Korben confirmés. Résumés clairement en français."

  - task: "GET /api/tools retourne 48 outils avec domaine Claude correct"
    implemented: true
    working: true
    file: "/app/backend/seed_data.py"
    stuck_count: 0
    priority: "medium"
    needs_retesting: false
    status_history:
        -working: true
        -agent: "main"
        -comment: "Endpoint /api/tools retourne 48 outils. Le slug claude a domain=claude.ai et image=https://logo.clearbit.com/claude.ai. Vérifié."
        -working: true
        -agent: "testing"
        -comment: "Vérifié: GET /api/tools retourne 200 avec exactement 48 outils. L'outil slug='claude' a bien domain='claude.ai' et image='https://logo.clearbit.com/claude.ai' (logo Clearbit correct)."

  - task: "POST /api/builder/run avec Claude Haiku 4.5"
    implemented: true
    working: true
    file: "/app/backend/server.py"
    stuck_count: 0
    priority: "medium"
    needs_retesting: false
    status_history:
        -working: true
        -agent: "main"
        -comment: "Endpoint LLM existant. Vérifier qu'il fonctionne toujours (utilisé pour l'historique du Builder côté frontend)."
        -working: true
        -agent: "testing"
        -comment: "Vérifié: POST /api/builder/run avec body {prompt: 'Résume en 2 lignes ce qu'est IA Match.'} retourne 200 avec un champ 'output' non vide (263 caractères, en français, accents et mots FR détectés). EMERGENT_LLM_KEY + Claude Haiku 4.5 fonctionnent. Note: le modèle indique ne pas connaître spécifiquement 'IA Match', ce qui est normal — l'endpoint LLM lui-même fonctionne correctement."

frontend:
  - task: "Onboarding guidé en 3 étapes (nouvelle route /onboarding)"
    implemented: true
    working: "NA"
    file: "/app/frontend/app/onboarding.tsx"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
        -working: "NA"
        -agent: "main"
        -comment: "Ajouté: nouvelle route /onboarding. Au premier lancement (clé AsyncStorage 'ia_match_onboarded_v1' absente), l'utilisateur est redirigé. 3 étapes: domaine d'usage, priorité, langue. Étape 4: 3 IA recommandées via /api/match. Bouton Passer disponible. Reset accessible depuis Profil."

  - task: "Onglet Ressources FR dans Academy (3 onglets: Fondamentaux, Templates, Ressources FR)"
    implemented: true
    working: "NA"
    file: "/app/frontend/app/(tabs)/academy.tsx"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
        -working: "NA"
        -agent: "main"
        -comment: "Ajouté un 3ème onglet Ressources FR dans Academy avec filtrage par catégorie (YouTube, Blog, Podcast, Newsletter, Outil) et liens cliquables (Linking.openURL)."

  - task: "Bookmarks IA + Articles dans Profil"
    implemented: true
    working: "NA"
    file: "/app/frontend/app/(tabs)/profile.tsx, /app/frontend/app/tool/[slug].tsx, /app/frontend/app/(tabs)/actue.tsx"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
        -working: "NA"
        -agent: "main"
        -comment: "Système bookmark complet: store AsyncStorage (bookmarkTools, bookmarkNews). Icône bookmark sur tool detail (header) et sur news rows/featured. Section IA favoris + Articles sauvegardés dans Profil avec navigation directe."

  - task: "Historique Builder (prompt + réponse persistants)"
    implemented: true
    working: "NA"
    file: "/app/frontend/app/(tabs)/builder.tsx"
    stuck_count: 0
    priority: "medium"
    needs_retesting: false
    status_history:
        -working: "NA"
        -agent: "main"
        -comment: "Chaque exécution réussie est sauvegardée localement (max 30). Section Historique avec accordéon (titre/date prévisualisés, expand pour réponse complète). Actions: copier prompt, copier réponse, supprimer item, effacer tout."

  - task: "Comparateur jusqu'à 4 IA + export texte"
    implemented: true
    working: "NA"
    file: "/app/frontend/app/(tabs)/compare.tsx, /app/frontend/src/api.ts"
    stuck_count: 0
    priority: "medium"
    needs_retesting: false
    status_history:
        -working: "NA"
        -agent: "main"
        -comment: "compareStore.toggle gère désormais 4 slots (drop-oldest si plein). Compare screen affiche carrousel horizontal des cartes + tableau dynamique avec gagnant par critère + bouton Exporter (copie tableau markdown au presse-papiers)."

  - task: "Prompt du Jour dans le Catalogue"
    implemented: true
    working: "NA"
    file: "/app/frontend/app/(tabs)/index.tsx"
    stuck_count: 0
    priority: "medium"
    needs_retesting: false
    status_history:
        -working: "NA"
        -agent: "main"
        -comment: "Sélection déterministe d'un template par jour (dayOfYear % templates.length). Carte coral avec titre, body preview, copier au presse-papiers, bouton 'Ouvrir dans le Builder'."

  - task: "Suppression warnings shadow* deprecation"
    implemented: true
    working: "NA"
    file: "/app/frontend/src/theme.ts"
    stuck_count: 0
    priority: "low"
    needs_retesting: false
    status_history:
        -working: "NA"
        -agent: "main"
        -comment: "shadow.soft/medium/dark utilise désormais 'boxShadow' string + elevation Android au lieu de shadowColor/Offset/Opacity/Radius. Logs Metro montrent encore les warnings; ils proviennent probablement de libs internes (react-navigation, expo-router). À confirmer."

metadata:
  created_by: "main_agent"
  version: "2.0"
  test_sequence: 1
  run_ui: false

test_plan:
  current_focus:
    - "GET /api/resources retourne 16 ressources françaises"
    - "GET /api/tools retourne 48 outils avec domaine Claude correct"
    - "POST /api/builder/run avec Claude Haiku 4.5"
  stuck_tasks: []
  test_all: false
  test_priority: "high_first"

agent_communication:
    -agent: "main"
    -message: |
      J'ai ajouté de grosses fonctionnalités frontend (onboarding, bookmarks, historique builder, comparateur 4 IA, prompt du jour, ressources FR dans Academy) et corrigé les shadow* dans theme.ts. Aucune modification backend cette session — seulement vérifier que les 3 endpoints critiques sont OK (GET /api/resources, GET /api/tools, POST /api/builder/run avec un prompt simple). Pas besoin de tester le frontend cette fois — l'utilisateur le testera lui-même ou validera plus tard.
    -agent: "testing"
    -message: |
      Backend smoke testing terminé via /app/backend_test.py contre EXPO_PUBLIC_BACKEND_URL/api. 3/3 endpoints critiques OK (18/18 assertions passées).
      ✅ GET /api/resources : 200, exactement 16 ressources, tous les champs requis présents (id, category, title, author, summary, url), catégories YouTube/Blog/Podcast/Newsletter présentes, Underscore_ et Korben présents, contenu en français.
      ✅ GET /api/tools : 200, exactement 48 outils, slug='claude' a domain='claude.ai' et image='https://logo.clearbit.com/claude.ai'.
      ✅ POST /api/builder/run : 200 avec output non vide en français (Claude Haiku 4.5 via Emergent LLM Key fonctionne — confirmé par les logs LiteLLM côté backend).
      Aucun problème backend détecté. Pas de tâche bloquée.
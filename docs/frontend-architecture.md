# Frontend architecture

The public homepage is a Vite + React application in `frontend/`. Pages, reusable components, data access, state, utilities, and styles are separated so a future API or database can replace the static catalog client without changing page composition. The current release has two routes: `/` and `/marketplace`.

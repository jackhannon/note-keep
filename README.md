Note Keeper is a simple note keeping web app that give users an intuitive way to
organize and select notes as a community. Users are presented with an intuitive range of base organization features, such as "archive" and "trash". Users are also able to organize notes customizably with labels, so notes are associated with eachother.

[Live application](keeperplus.up.railway.app)


Features include but not limited to: 
  - "Multi-select mode" can be turn on via clicking the checkmark in any note's
    top left corner. This will allow for selection of multiple notes at once to
    perform a procedure

  - custom label editing and creation can be done via the editing menu, allowing
    notes to be organized by a label of the users choosing

  - infinite scroll for labels that have many notes

  - note order preservation


Frontend built with:
  - React
  - React-Router
  - React-Query
  - TypeScript


Backend built with:
  - MongoDB
  - Express
  - TypeScript

System Info:
  - Node version - 18.12.1
  - Browser and version - Chrome version 122.0.6261.95
  - MongoDB version - 6.0.4


How to install and run: 

  1. run `npm install` in the bash console in the `backend` directory of the project

  2. run `npm install` in the bash console in the `frontend` directory of the project

  2. Configure enviroment variables:
    - setting the `ATLAS_URI` variable is crucial to the functioning of the application
      as it does not have a default value
        
  4. In the `frontend` directory run `npm run dev` in the bash console to start both the backend and frontend start commands

import { NoteType } from "../interfaces"

type ChangedMultiSelectMode = {
  type: "CHANGED_MULTI_SELECT_MODE"
  payload: boolean
}

type NoteToggleClicked = {
  type: "NOTE_TOGGLE_CLICKED"
  payload: NoteType
}

type ToggledModeOff = {
  type: "TOGGLED_MODE_OFF"
}

type ToggledModeOn = {
  type: "TOGGLED_MODE_ON",
  payload: NoteType
}

export type SelectedNotesActions = ChangedMultiSelectMode | NoteToggleClicked | ToggledModeOff | ToggledModeOn;

export type SelectedNotesReducerState = {
  notes: NoteType[],
  modeOn: boolean
}

export const CHANGED_MULTI_SELECT_MODE = "CHANGED_MULTI_SELECT_MODE"
export const NOTE_TOGGLE_CLICKED = "NOTE_TOGGLE_CLICKED"
export const TOGGLED_MODE_OFF = "TOGGLED_MODE_OFF"
export const TOGGLED_MODE_ON = "TOGGLED_MODE_ON"



//two pieces of state:
// 1. the array of selected notes to perform an operation on
// 2. the boolean determining if the the multi-note-selecting-mode is on
function selectedNotesReducer(state: SelectedNotesReducerState, action: SelectedNotesActions): SelectedNotesReducerState {
  switch (action.type) {
    case CHANGED_MULTI_SELECT_MODE: {
      return {
        notes: [],
        modeOn: false
      }
    }
    case NOTE_TOGGLE_CLICKED: {
      let newState: NoteType[];
      const noteIds = state.notes.map(note => note._id)
      if (noteIds.includes(action.payload._id)) {
        newState = state.notes.filter(note => note._id !== action.payload._id);
      } else {
        newState = [...state.notes, action.payload];
      }
      return {
        notes: newState,
        modeOn: newState.length > 0
      }
    }
    case TOGGLED_MODE_OFF: {
      return {
        notes: [],
        modeOn: false
      }
    }
    case TOGGLED_MODE_ON: {
      return {
        notes: [action.payload],
        modeOn: false
      }
    }
    default: {
      return state;
    }
  }
}

export default selectedNotesReducer
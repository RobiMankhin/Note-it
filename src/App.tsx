import { Navigate, Route, Routes } from "react-router-dom";
import NewNote from "./Components/NewNote";
import "./App.css";
import { useLocalStorage } from "./Components/Hook/useLocalStorage";
import { useMemo } from "react";
import { v4 } from "uuid";
import NoteList from "./Components/NoteList";
import NoteLayout from "./Components/NoteLayout";
import Note from "./Components/Note";
import EditNote from "./Components/EditNote";

export type Note = {
  id: string;
} & NoteData;
export type NoteData = {
  title: string;
  markdown: string;
  tags: tag[];
};

export type RawNote = {
  id: string;
} & RawNoteData;
export type RawNoteData = {
  title: string;
  markdown: string;
  tagIds: string[];
};

export type tag = {
  id: string;
  label: string;
};
function App() {
  const [notes, setNotes] = useLocalStorage<RawNote[]>("NOTES", []);
  const [tags, setTags] = useLocalStorage<tag[]>("TAGS", []);

  const notesWithTags = useMemo(() => {
    return notes.map((note) => {
      return {
        ...note,
        tags: tags.filter((tag) => note.tagIds.includes(tag.id)),
      };
    });
  }, [notes, tags]);

  function onCreateNote({ tags, ...data }: NoteData) {
    setNotes((prevNotes) => {
      return [
        ...prevNotes,
        { ...data, id: v4(), tagIds: tags.map((tag) => tag.id) },
      ];
    });
  }

  function onUpdateNote(id: string, { tags, ...data }: NoteData) {
    setNotes((prevNotes) =>
      prevNotes.map((note) => {
        if (note.id == id) {
          return { ...note, ...data, tagIds: tags.map((t) => t.id) };
        } else {
          return note;
        }
      })
    );
  }

  function deleteNote(id: string) {
    setNotes((prevNotes) => {
      return prevNotes.filter((note) => note.id !== id);
    });
  }

  function addTag(tag: tag) {
    setTags((prev) => [...prev, tag]);
  }

  function deleteTag(id: string) {
    setTags((prev) => {
      return prev.filter((t) => t.id !== id);
    });
  }

  function updateTag(id: string, label: string) {
    setTags((prev) => {
      return prev.map((t) => {
        if (t.id === id) {
          return { ...t, label };
        } else {
          return t;
        }
      });
    });
  }
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <NoteList
              notes={notesWithTags}
              deleteTag={deleteTag}
              updateTag={updateTag}
              availableTags={tags}
            />
          }
        />
        <Route
          path="/new"
          element={
            <NewNote
              onSubmit={onCreateNote}
              onAddTag={addTag}
              availableTags={tags}
            />
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/:id" element={<NoteLayout notes={notesWithTags} />}>
          <Route index element={<Note onDelete={deleteNote} />} />
          <Route
            path="edit"
            element={
              <EditNote
                onSubmit={onUpdateNote}
                onAddTag={addTag}
                availableTags={tags}
              />
            }
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;

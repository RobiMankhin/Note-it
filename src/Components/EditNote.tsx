import { NoteData, tag } from "../App";
import NoteForm from "./NoteForm";
import { useNote } from "./NoteLayout";
type NewNoteProps = {
  onSubmit: (id: string, data: NoteData) => void;
  onAddTag: (data: tag) => void;
  availableTags: tag[];
};

const EditNote = ({ onSubmit, onAddTag, availableTags }: NewNoteProps) => {
  const note = useNote();
  return (
    <div>
      <h2 className="mb-3">NewNote</h2>
      <NoteForm
        title={note.title}
        markdown={note.markdown}
        tags={note.tags}
        onSubmit={(submitData) => onSubmit(note.id, submitData)}
        onAddTag={onAddTag}
        availableTags={availableTags}
      />
    </div>
  );
};

export default EditNote;

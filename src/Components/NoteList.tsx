import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { tag } from "../App";
import CreatableSelect from "react-select/creatable";
type EditTagsModalProps = {
  show: boolean;
  availableTags: tag[];
  handleClose: () => void;
  deleteTag: (id: string) => void;
  updateTag: (id: string, label: string) => void;
};
type NoteListProps = {
  availableTags: tag[];
  notes: simpleNotes[];
  deleteTag: (id: string) => void;
  updateTag: (id: string, label: string) => void;
};

type simpleNotes = {
  tags: tag[];
  title: string;
  id: string;
};
const NoteList = ({
  availableTags,
  notes,
  deleteTag,
  updateTag,
}: NoteListProps) => {
  const [selecttags, setSelecttags] = useState<tag[]>([]);
  const [title, setTitle] = useState("");
  const [EditTagsModalOpen, setEditTagsModalOpen] = useState(false);

  function handleClose() {
    setEditTagsModalOpen(false);
  }

  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      return (
        (title === "" ||
          note.title.toLowerCase().includes(title.toLowerCase())) &&
        (selecttags.length === 0 ||
          selecttags.every((tag) => {
            return note.tags.some((noteTag) => noteTag.id === tag.id);
          }))
      );
    });
  }, [notes, selecttags, title]);
  return (
    <div className="flex  flex-col gap-4">
      <div className="flex gap-4 flex-col md:flex-row p-2 md:justify-between md:min-w-[720px]  ">
        <h2 className="text-3xl font-bold">Notes</h2>
        <div className="flex gap-3 items-center">
          <Link to="/new">
            <button className="bg-blue-500 hover:text-gray-200 text-white rounded-md font-semibold p-1 px-2">
              Create
            </button>
          </Link>

          <button
            onClick={() => setEditTagsModalOpen(true)}
            className=" text-gray-700 border hover:text-gray-500 border-gray-600 rounded-md font-semibold p-1"
          >
            Edit Tags
          </button>
        </div>
      </div>
      <form className="  md:min-w-[720px] p-2">
        <div className="flex flex-col md:flex-row justify-around">
          <div className="mt-1">
            <label htmlFor="title">
              <div className=" py-2 font-semibold">Title</div>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                //   ref={titleref}
                className="p-1 w-[210px] rounded-md border-gray-400 border px-2"
                placeholder="Enter Title...."
                id="title"
                name="title"
                //   required
              />
            </label>
          </div>
          <div className=" ">
            <label htmlFor="tags">
              <div className=" py-2 font-semibold">Tags</div>
              <CreatableSelect
                className=" w-[210px]"
                isMulti
                value={selecttags.map((t) => {
                  return { label: t.label, value: t.id };
                })}
                options={availableTags.map((tag) => ({
                  label: tag.label,
                  value: tag.id,
                }))}
                onChange={(tags) =>
                  setSelecttags(
                    (tags as readonly { label: string; value: string }[]).map(
                      (t) => ({ label: t.label, id: t.value })
                    )
                    // tags.map((t) => ({ label: t.label, id: t.value }))
                  )
                }
              />
            </label>
          </div>
        </div>
      </form>
      <div className="flex  flex-wrap md:justify-center  md:min-w-[720px]  gap-6 p-2 ">
        {filteredNotes.map((note) => (
          <div key={note.id}>
            <NoteCard id={note.id} tags={note.tags} title={note.title} />
          </div>
        ))}
      </div>
      <EditTagsModal
        updateTag={updateTag}
        deleteTag={deleteTag}
        show={EditTagsModalOpen}
        availableTags={availableTags}
        handleClose={handleClose}
      />
    </div>
  );
};

export default NoteList;

// it's for editing tags
function EditTagsModal({
  deleteTag,
  updateTag,
  show,
  availableTags,
  handleClose,
}: EditTagsModalProps) {
  if (show == false) {
    return null;
  }
  return (
    <div className="fixed inset-0  bg-black bg-opacity-60 z-50 p-2 flex items-center justify-center flex-col gap-2 ">
      <div className="bg-white rounded-lg p-3 w-ful ">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold">Edit Tags</h1>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={handleClose}
          >
            close
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {availableTags.map((tag, i) => (
            <div key={i} className="flex gap-2">
              <input
                onChange={(e) => updateTag(tag.id, e.target.value)}
                type="text"
                value={tag.label}
                className="border border-gray-300 rounded-md p-1 md:p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />

              <button
                onClick={() => deleteTag(tag.id)}
                className="text-red-500 px-2 md:px-3 rounded-md border border-gray-500 font-semibold hover:text-red-700"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleClose}
            className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function NoteCard({ id, title, tags }: simpleNotes) {
  return (
    <Link
      to={`/${id}`}
      className=" h-[120px] flex flex-col items-center hover:scale-105 border shadow-gray-300 border-gray-100 duration-200 hover:-translate-y-1 rounded-md shadow-lg p-2 w-[220px] md:w-[260px]"
    >
      <h2 className="font-semibold text-gray-800">{title}</h2>
      {/* <h2>{id}</h2> */}
      <div className="flex flex-wrap gap-1 mt-2">
        {tags.map((tag) => (
          <span
            key={tag.id}
            className="bg-blue-400 px-1 mx-[2px] rounded-lg text-sm"
          >
            {tag.label}
          </span>
        ))}
      </div>
    </Link>
  );
}

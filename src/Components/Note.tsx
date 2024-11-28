import { Link, useNavigate } from "react-router-dom";
import { useNote } from "./NoteLayout";

type NoteProps = {
  onDelete: (data: string) => void;
};
const Note = ({ onDelete }: NoteProps) => {
  const noteOutlet = useNote();
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between flex-col md:flex-row gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{noteOutlet.title}</h1>
          <div className="flex flex-wrap gap-1 mt-2">
            {noteOutlet.tags.map((tag) => (
              <span
                key={tag.id}
                className="bg-blue-400 font-semibold px-1 mx-[2px] rounded-lg text-sm"
              >
                {tag.label}
              </span>
            ))}
          </div>
        </div>

        <div className="flex gap-3 items-center">
          <Link to={`/${noteOutlet.id}/edit`}>
            <button className=" bg-blue-500 hover:text-gray-200 text-white rounded-md font-semibold p-1 px-2">
              Edit
            </button>
          </Link>
          <button
            onClick={() => {
              onDelete(noteOutlet.id);
              navigate("/");
            }}
            className="text-gray-700 border hover:text-gray-500 border-gray-600 rounded-md font-semibold p-1"
          >
            Delete
          </button>
          <Link to="/">
            <button className="text-gray-700 border hover:text-gray-500 border-gray-600 rounded-md font-semibold p-1">
              Back
            </button>
          </Link>
        </div>
      </div>
      <div>{noteOutlet.markdown}</div>
    </div>
  );
};

export default Note;

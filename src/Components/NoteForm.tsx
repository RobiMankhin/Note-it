import { FormEvent, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CreatableSelect from "react-select/creatable";
import { NoteData, tag } from "../App";
import { v4 } from "uuid";

type NoteFormprops = {
  onSubmit: (data: NoteData) => void;
  onAddTag: (data: tag) => void;
  availableTags: tag[];
} & Partial<NoteData>;
const NoteForm = ({
  onSubmit,
  onAddTag,
  availableTags,
  title = "",
  tags = [],
  markdown = "",
}: NoteFormprops) => {
  const titleref = useRef<HTMLInputElement>(null);
  const markdownref = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();

  const [selecttags, setSelecttags] = useState<tag[]>(tags);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({
      title: titleref.current!.value,
      markdown: markdownref.current!.value,
      tags: selecttags,
    });
    navigate("..");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-300 p-2">
      <div className="flex gap-4 items-center flex-wrap">
        <div className="">
          <label htmlFor="title">
            <div className=" p-2">Title</div>
            <input
              defaultValue={title}
              ref={titleref}
              className="p-1 rounded-md border-gray-400 border px-2"
              placeholder="enter"
              id="title"
              name="title"
              required
            />
          </label>
        </div>
        <div className=" ">
          <label htmlFor="tags">
            <div className=" p-2">Tags</div>
            <CreatableSelect
              className=" w-[240px] rounded-md"
              isMulti
              value={selecttags.map((t) => {
                return { label: t.label, value: t.id };
              })}
              options={availableTags.map((tag) => ({
                label: tag.label,
                value: tag.id,
              }))}
              onCreateOption={(label) => {
                const newTag = { id: v4(), label };
                onAddTag(newTag);
                setSelecttags((prev) => [...prev, newTag]);
              }}
              onChange={(tags) =>
                setSelecttags(
                  tags.map((t) => ({ label: t.label, id: t.value }))
                )
              }
              // onChange={(tags) =>
              //   setSelecttags(
              //     tags.map((t) => {
              //       return { label: t.label, id: t.id };
              //     })
              //   )
              // }
            />
          </label>
        </div>
      </div>
      <div className="  ">
        <label htmlFor="body">
          <div className=" p-2">Body</div>
          <textarea
            defaultValue={markdown}
            ref={markdownref}
            className="p-1 w-[210px] md:w-[450px] rounded-md border-gray-400 border "
            placeholder="enter...."
            id="body"
            name="body"
            required
            rows={3}
            //   cols={10}
          />
        </label>
        <div className=" flex justify-end gap-4 w-[210px] md:w-[450px]">
          <button
            type="submit"
            className="px-2 py-1 text-yellow-200 rounded-md bg-blue-600 text-sm font-semibold"
          >
            Save
          </button>
          <Link to="..">
            <button
              type="button"
              className="border border-gray-500 px-1 py-1 hover:bg-gray-300 rounded-md bg-white text-sm font-semibold"
            >
              Cancel
            </button>
          </Link>
        </div>
      </div>
    </form>
  );
};

export default NoteForm;

import "./App.css";
import { Editor } from "@monaco-editor/react";
import { useRef, useMemo, useState, useEffect } from "react";
import { MonacoBinding } from "y-monaco";
import * as Y from "yjs";
import { SocketIOProvider } from "y-socket.io";
import { removeAwarenessStates } from "y-protocols/awareness.js";

function App() {
  // const editorRef = useRef(null);
  const [editor, setEditor] = useState(null);
  const [username, setUserName] = useState(() => {
    return new URLSearchParams(window.location.search).get("username") || "";
  });

  const [users, setUsers] = useState([]);
  // const ydoc = new Y.Doc();
  // const yText = ydoc.getText("monaco");
  const ydoc = useMemo(() => new Y.Doc(), []);
  const yText = useMemo(() => ydoc.getText("monaco"), [ydoc]);

  const handleMount = (editorInstance) => {
    setEditor(editorInstance);
  };

  useEffect(() => {
    if (!username || !editor) return;

    const provider = new SocketIOProvider(
      "/",
      "monaco",
      ydoc,
      { autoConnect: true },
    );

    provider.awareness.setLocalStateField("user", { username });

    const onAwarenessChange = () => {
      const states = Array.from(provider.awareness.getStates().values());
      // console.log("states",states)
      let names = states.map((s) => s.user?.username).filter(Boolean);
      console.log("names", names);
      const unique = [...new Set(names)];
      console.log("unique", unique);
      setUsers([...new Set(names)].map((username) => ({ username })));
    };

    provider.awareness.on("change", onAwarenessChange);

    function handleLeave() {
      removeAwarenessStates(provider.awareness, [ydoc.clientID], "unload");
      // provider.awareness.setLocalStateField("user",null);
    }

    window.addEventListener("pagehide", handleLeave);
    onAwarenessChange();

    const binding = new MonacoBinding(
      yText,
      editor.getModel(),
      new Set([editor]),
      provider.awareness,
    );

    return () => {
      binding.destroy();
      provider.awareness.off("change", onAwarenessChange);
      provider.awareness.setLocalState(null);
      provider.destroy();
      window.removeEventListener("pagehide", handleLeave);
    };
  }, [editor, ydoc, yText, username]);

  const handleJoin = (e) => {
    e.preventDefault();
    const name = e.target.username.value;
    setUserName(name);
    window.history.pushState({}, "", "?username=" + name);
  };

  if (!username) {
    return (
      <main className="h-screen w-full bg-amber-100 flex items-center justify-center p-4">
        <form
          onSubmit={handleJoin}
          className="w-full max-w-xs rounded-xl bg-olive-700 p-6 shadow-lg"
        >
          <h1 className="mb-2 text-center text-xl font-bold text-white">
            Join Editor
          </h1>

          <label
            htmlFor="name"
            className="mb-2 block text-sm font-normal text-white"
          >
            Your Name
          </label>

          <input
            id="name"
            type="text"
            name="username"
            placeholder="Enter your name"
            className="mb-4 w-full rounded-lg border border-white/10 bg-white px-4 py-3 text-gray-800 outline-none placeholder:text-gray-400 focus:border-amber-300 focus:ring-2 focus:ring-amber-200"
          />

          <button className="w-full rounded-lg bg-amber-100 px-4 py-3 font-semibold text-olive-700 transition hover:bg-amber-200">
            Join
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="h-screen w-full bg-gray-950 flex gap-2 p-2">
      <aside className="h-full w-1/6 bg-amber-100 rounded-lg">
        <h2 className="m-2 mb-3 text-sm font-bold uppercase tracking-wide text-olive-700">
          Online ({users.length})
        </h2>

        <ul className="space-y-2">
          {users.map((u) => (
            <li
              key={u.username}
              className="flex items-center gap-2 rounded-lg bg-amber-200 mx-2 px-3 py-2 text-sm text-gray-800 shadow-sm"
            >
              <span className="h-2 w-2 rounded-full bg-green-500" />
              <span className="truncate">
                {u.username}
                {u.username === username && (
                  <span className="ml-1 text-xs text-gray-600">(you)</span>
                )}
              </span>
            </li>
          ))}
        </ul>
      </aside>

      <section className="w-5/6 bg-olive-700 rounded-lg overflow-hidden">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          defaultValue="// some comment"
          theme="vs-dark"
          onMount={handleMount}
        />
      </section>
    </main>
  );
}

export default App;

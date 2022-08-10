import "./App.css";
import { useState } from "react";

function Header(props) {
  return (
    <header>
      <h1>
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            props.onChangeMode();
          }}
        >
          {props.title}
        </a>
      </h1>
    </header>
  );
}

function Nav(props) {
  const list = [];
  props.topics.map((topic) => {
    list.push(
      <li key={topic.id}>
        <a
          id={topic.id}
          href={"/read/" + topic.id}
          onClick={(e) => {
            e.preventDefault();
            props.onChangeMode(Number(e.target.id));
          }}
        >
          {topic.title}
        </a>
      </li>
    );
    return null;
  });

  return (
    <nav>
      <ol>{list}</ol>
    </nav>
  );
}

function Article(props) {
  return (
    <article>
      <h2>{props.title}</h2>
      {props.body}
    </article>
  );
}

function Create(props) {
  return (
    <article>
      <h2>Create</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const title = e.target.title.value;
          const body = e.target.body.value;
          props.onCreate(title, body);
        }}
      >
        <p>
          <input type="text" name="title" placeholder="title" />
        </p>
        <p>
          <textarea name="body" placeholder="body" />
        </p>
        <p>
          <input type="submit" value="Create" />
        </p>
      </form>
    </article>
  );
}

function Update(props) {
  const [title, setTitle] = useState(props.title);
  const [body, setBody] = useState(props.body);
  return (
    <article>
      <h2>Update</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const title = e.target.title.value;
          const body = e.target.body.value;
          props.onUpdate(title, body);
        }}
      >
        <p>
          <input
            type="text"
            name="title"
            placeholder="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </p>
        <p>
          <textarea
            name="body"
            placeholder="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </p>
        <p>
          <input type="submit" value="Update" />
        </p>
      </form>
    </article>
  );
}

function App() {
  // const _mode = useState("WELCOME");
  // const mode =  _mode[0];
  // const setMode = _mode[1]
  const [mode, setMode] = useState("WELCOME");
  const [id, setId] = useState("id");
  const [nextId, setNextId] = useState(4);
  const [topics, setTopics] = useState([
    { id: 1, title: "html", body: "html is ..." },
    { id: 2, title: "css", body: "css is ..." },
    { id: 3, title: "javascript", body: "javascript is ..." },
  ]);

  let content = null;
  let contextControl = null;

  if (mode === "WELCOME") {
    content = <Article title="Web" body="Hello, Web"></Article>;
  } else if (mode === "READ") {
    let title,
      body = null;
    for (let i = 0; i < topics.length; i++) {
      if (id === topics[i].id) {
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    content = <Article title={title} body={body}></Article>;
    contextControl = (
      <>
        <li>
          <a
            href={"/update/" + id}
            onClick={(e) => {
              e.preventDefault();
              setMode("UPDATE");
            }}
          >
            Update
          </a>
        </li>
        <li>
          <input
            type="button"
            value="Delete"
            onclick={() => {
              const newTopics = [];
              for (let i = 0; i < topics.length; i++) {
                if (topics[i] !== id) {
                  newTopics.push(topics[i]);
                }
              }
              setTopics(newTopics);
              setMode("WELCOME");
            }}
          />
        </li>
      </>
    );
  } else if (mode === "CREATE") {
    content = (
      <Create
        onCreate={(title, body) => {
          const newTopic = { id: nextId, title: title, body: body };
          const newTopcis = [...topics];
          newTopcis.push(newTopic);
          setTopics(newTopcis);
          setMode("READ");
          setId(nextId);
          setNextId(nextId + 1);
        }}
      ></Create>
    );
  } else if (mode === "UPDATE") {
    let title,
      body = null;
    for (let i = 0; i < topics.length; i++) {
      if (id === topics[i].id) {
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    content = (
      <Update
        title={title}
        body={body}
        onUpdate={(title, body) => {
          const newTopcis = [...topics];
          const updatedTopic = { id: id, title: title, body: body };
          for (let i = 0; i < newTopcis.length; i++) {
            if (newTopcis[i] === id) {
              newTopcis[i] = updatedTopic;
              break;
            }
          }
          setTopics(newTopcis);
          setMode("READ");
        }}
      ></Update>
    );
  }

  return (
    <div>
      <Header
        title="React"
        onChangeMode={() => {
          setMode("WELCOME");
        }}
      ></Header>
      <Nav
        topics={topics}
        onChangeMode={(id) => {
          setMode("READ");
          setId(id);
        }}
      ></Nav>
      {content}
      <ul>
        <li>
          <a
            href="/create"
            onClick={(e) => {
              e.preventDefault();
              setMode("CREATE");
            }}
          >
            Create
          </a>
        </li>
        {contextControl}
      </ul>
    </div>
  );
}

export default App;

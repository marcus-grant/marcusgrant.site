const Root = () => {
  return (
    <>
      You can edit your package in:
      <pre>packages/retrobox-theme/src/index.js</pre>
    </>
  );
};

export default {
  name: "retrobox-theme",
  roots: {
    retroboxTheme: Root
  },
  state: {
    retroboxTheme: {}
  },
  actions: {
    retroboxTheme: {}
  }
};

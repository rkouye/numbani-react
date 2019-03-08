import path from 'path';

export default {
    src: "./docs",
    title: "numbani-react",
    description: "Prototype faster 🌠 with React. Contains useful helpers.",
    indexHtml: "docs/index.html",
    menu: [
        "1. Getting started",
        "2. Authentication",
        {
            name: "3. Data",
            menu: [
                "1. Concepts",
                "2. Load and display data",
                "3. Edit, validate and save data"
            ]
        },
        "References"
    ],
    modifyBundlerConfig: (config) => {
        // Allow css
        config.module.rules.push({
            test: /\.css$/,
            use: ["style-loader", "css-loader"]
        });

        config.resolve = config.resolve || {};
        config.resolve.alias = config.resolve.alias || {};

        // Allow import from numbani-react/lib
        config.resolve.alias['numbani-react/lib'] = path.resolve(__dirname, 'src');
        // Allow import from numbani-react/docs
        config.resolve.alias['numbani-react/docs'] = path.resolve(__dirname, 'docs');

        return config
    }
}
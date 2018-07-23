import path from 'path';

export default {
    source: "./docs",
    title: "numbani-react",
    description: "A React library for fast prototyping. Contains useful helpers.",
    indexHtml : "docs/index.html",
    modifyBundlerConfig: (config) => {
        // Allow css
        config.module.rules.push({
            test: /\.css$/,
            use: ["style-loader", "css-loader"]
        });

        // Allow import from numbani-react/lib
        config.resolve.alias['numbani-react/lib'] = path.resolve(__dirname, 'src');
        // Allow import from numbani-react/docs
        config.resolve.alias['numbani-react/docs'] = path.resolve(__dirname, 'docs');

        return config
    }
}
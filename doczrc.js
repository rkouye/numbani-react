export default {
    source: "./docs",
    title: "numbani-react",
    description: "A React library for fast prototyping. Contains useful helper for Firebase and Bootstrap.",
    indexHtml : "docs/index.html",
    hashRouter : true,
    modifyBundlerConfig: (config) => {
        config.module.rules.push({
            test: /\.css$/,
            use: ["style-loader", "css-loader"]
        })

        return config
    }
}
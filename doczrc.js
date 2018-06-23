export default {
    source: "./docs",
    title: "Numbani-react",
    description: "A React library for fast prototyping. Contains useful helper for Firebase and Bootstrap.",
    modifyBundlerConfig: (config) => {
        config.module.rules.push({
            test: /\.css$/,
            use: ["style-loader", "css-loader"]
        })

        return config
    }
}
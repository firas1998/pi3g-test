<template>
	<div id="app">
		<p>Currency configurations</p>
		<br />
		<br />
		<ConfigurationBoxList :configs="config" />
	</div>
</template>

<script>
import axios from "axios";
import ConfigurationBoxList from "./components/ConfigurationBoxList.vue";

export default {
	name: "App",
	components: {
		ConfigurationBoxList,
	},
	data() {
		return {
			config: null,
		};
	},
	methods: {
		async getConfig() {
			//console.log(process.env.VUE_APP_API);
			const resp = await axios.get(
				`${process.env.VUE_APP_API}/config/all`
			);
			this.config = resp.data;
		},
	},
	async created() {
		await this.getConfig();
	},
};
</script>

<style>
#app {
	text-align: center;
	margin-top: 40px;
}

p {
	font-size: 60px;
	font-weight: bold;
}
</style>

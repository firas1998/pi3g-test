<template>
	<div class="container">
		<ConfigurationBox
			v-for="config in configs"
			:config="config"
			:key="config.currency"
		/>
	</div>
</template>

<script>
import ConfigurationBox from "./ConfigurationBox.vue";

export default {
	name: "ConfigurationBoxList",
	props: {
		configs: Array,
	},
	components: {
		ConfigurationBox,
	},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
	width: 60%;
	height: 600px;
	margin-left: auto;
	margin-right: auto;
	border: 2px black solid;
	border-radius: 15px;
	box-shadow: 4px 4px;
	padding: 16px;
	overflow-y: scroll;
}
</style>

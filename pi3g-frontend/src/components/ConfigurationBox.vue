<template>
	<section>
		<b-collapse
			:open="false"
			class="card"
			animation="slide"
			aria-id="contentIdForA11y3"
		>
			<template #trigger="props">
				<div
					class="card-header"
					role="button"
					aria-controls="contentIdForA11y3"
					:aria-expanded="props.open"
				>
					<p class="card-header-title">{{ config.currency }}</p>
					<a class="card-header-icon">
						<b-icon :icon="props.open ? 'menu-down' : 'menu-up'">
						</b-icon>
					</a>
				</div>
			</template>

			<div class="card-content">
				<div class="content">
					<table>
						<tr>
							<th>Internal rate:</th>
							<th>Latest rate:</th>
							<th>Upper limit:</th>
							<th>Lower limit:</th>
							<th>Status:</th>
						</tr>
						<tr>
							<td v-if="!inEditMode">
								{{ config.internalRate.toFixed(4) }}
							</td>
							<td v-if="inEditMode">
								<b-input
									custom-class="inputText"
									v-model="internalRate"
								></b-input>
							</td>
							<td>
								{{ config.latestRate.toFixed(4) }}
							</td>
							<td v-if="!inEditMode">
								{{ config.upperLimit.toFixed(2) }}
							</td>
							<td v-if="inEditMode">
								<b-input v-model="upperLimit"></b-input>
							</td>
							<td v-if="!inEditMode">
								{{ config.lowerLimit.toFixed(2) }}
							</td>
							<td v-if="inEditMode">
								<b-input v-model="lowerLimit"></b-input>
							</td>
							<td>
								<b-icon
									class="block"
									:icon="
										isPriceCrossing
											? 'alert-circle'
											: 'check-circle'
									"
									size="is-medium"
									:type="
										isPriceCrossing
											? 'is-warning'
											: 'is-success'
									"
								>
								</b-icon>
							</td>
						</tr>
					</table>
				</div>
			</div>
			<footer class="buttons">
				<b-button
					@click="updateConfig"
					type="is-primary"
					v-if="inEditMode"
					class="card-footer-item"
				>
					Save
				</b-button>
				<b-button
					@click="toggleInEditMode"
					class="card-footer-item"
					:type="inEditMode ? 'is-primary is-light' : 'is-primary'"
				>
					{{ inEditMode ? "Cancel" : "Edit" }}
				</b-button>
			</footer>
		</b-collapse>
		<br />
	</section>
</template>

<script>
import axios from "axios";
import { CurrencyConfig } from "../DTOs/CurrencyConfig";

export default {
	name: "ConfigurationBox",
	props: {
		config: CurrencyConfig,
	},
	computed: {
		isPriceCrossing() {
			return (
				this.config.latestRate >
					this.config.internalRate + this.config.upperLimit ||
				this.config.latestRate <
					this.config.internalRate - this.config.lowerLimit
			);
		},
	},
	data() {
		return {
			internalRate: parseFloat(this.config.internalRate).toFixed(4),
			latestRate: parseFloat(this.config.latestRate).toFixed(4),
			upperLimit: parseFloat(this.config.upperLimit).toFixed(4),
			lowerLimit: parseFloat(this.config.lowerLimit).toFixed(4),
			inEditMode: false,
		};
	},
	methods: {
		toggleInEditMode() {
			this.inEditMode = !this.inEditMode;
		},
		async updateConfig() {
			this.config.internalRate = Number(this.internalRate);
			this.config.latestRate = Number(this.latestRate);
			this.config.upperLimit = Number(this.upperLimit);
			this.config.lowerLimit = Number(this.lowerLimit);
			console.log(this.config);
			await axios.put(
				`${process.env.VUE_APP_API}/config/update`,
				this.config
			);
			this.toggleInEditMode();
		},
	},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>

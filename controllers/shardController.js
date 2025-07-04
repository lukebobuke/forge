/** @format */

const shardModel = require("../models/shardModel");

// ----------------------------------------------------------------------------------------------------
// #region Render
// ----------------------------------------------------------------------------------------------------
const renderShardsPage = async (req, res) => {
	try {
		// DEBUG: Log req.user to see what's available
		console.log("renderShardsPage req.user:", req.user);

		const user = req.user;
		if (!user || !user.id) {
			return res.status(401).send("Unauthorized: No user found.");
		}
		const shards = await shardModel.getShardsByUserId(user.id);
		res.render("shardsPage", { currentPage: "shards", shards, user });
	} catch (error) {
		console.error("Error rendering shards page:", error);
		res.status(500).send("Internal Server Error");
	}
};

const renderShardList = async (req, res) => {
	try {
		const user = req.user;
		if (!user || !user.id) return res.status(401).send("Unauthorized");
		const shards = await shardModel.getShardsByUserId(user.id);
		res.render("partials/shardList", { shards }, (err, html) => {
			if (err) return res.status(500).send("Render error");
			res.send(html);
		});
	} catch (err) {
		res.status(500).send("Server error");
	}
};

// #endregion
// ----------------------------------------------------------------------------------------------------

// ----------------------------------------------------------------------------------------------------
// #region Create Shard
// ----------------------------------------------------------------------------------------------------
const createShard = async (req, res) => {
	const userId = req.user.id;
	const shardData = req.body;

	try {
		await shardModel.createShard(userId, shardData);
		// Immediately render and return the updated shard list partial
		const shards = await shardModel.getShardsByUserId(userId);
		res.render("partials/shardList", { shards }, (err, html) => {
			if (err) {
				console.error("Error rendering shard list:", err);
				return res.status(500).send("Render error");
			}
			res.send(html);
		});
	} catch (error) {
		console.error("Error creating shard:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};
// #endregion
// ----------------------------------------------------------------------------------------------------

// ----------------------------------------------------------------------------------------------------
// #region Get Shards By User ID
// ----------------------------------------------------------------------------------------------------
const getShardsByUserId = async (userId) => {
	try {
		const shards = await shardModel.getShardsByUserId(userId);
		return shards;
	} catch (error) {
		console.error("Error fetching shards by user ID:", error);
		throw error;
	}
};
// #endregion
// ----------------------------------------------------------------------------------------------------

// ----------------------------------------------------------------------------------------------------
// #region Get Shard By ID
// ----------------------------------------------------------------------------------------------------
const getShardById = async (shardId) => {
	try {
		const shard = await shardModel.getShardById(shardId);
		return shard;
	} catch (error) {
		console.error("Error fetching shard by ID:", error);
		throw error;
	}
};
// #endregion
// ----------------------------------------------------------------------------------------------------

// ----------------------------------------------------------------------------------------------------
// #region Update Shard
// ----------------------------------------------------------------------------------------------------
const updateShard = async (req, res) => {
	const shardId = req.params.shardId;
	const shardData = req.body;

	try {
		const updatedShard = await shardModel.updateShard(shardId, shardData);
		res.status(200).json(updatedShard);
	} catch (error) {
		console.error("Error updating shard:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};
// #endregion
// ----------------------------------------------------------------------------------------------------

// ----------------------------------------------------------------------------------------------------
// #region Delete Shard
// ----------------------------------------------------------------------------------------------------
const deleteShard = async (req, res) => {
	const shardId = req.params.shardId;

	try {
		await shardModel.deleteShard(shardId);
		res.status(204).send();
	} catch (error) {
		console.error("Error deleting shard:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};
// #endregion
// ----------------------------------------------------------------------------------------------------

// ----------------------------------------------------------------------------------------------------
// #region Exports
// ----------------------------------------------------------------------------------------------------
module.exports = {
	renderShardsPage,
	renderShardList,
	createShard,
	getShardsByUserId,
	getShardById,
	updateShard,
	deleteShard,
};

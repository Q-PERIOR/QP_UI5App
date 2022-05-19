sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/Sorter",
	"sap/ui/core/Fragment",
	"sap/ui/model/json/JSONModel",
	'sap/m/MessageToast',
], function (Controller, Filter, FilterOperator, Sorter, Fragment, JSONModel, MessageToast) {
	"use strict";

	return Controller.extend("TechInnovation.TechInnovation.controller.Detail", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf TechInnovation.TechInnovation.view.Detail
		 */
		onInit: function () {

		},

		onSearch: function (oEvent) {
			var aFilters = [];
			var sQuery = oEvent.getSource().getValue();
			if (sQuery && sQuery.length > 0) {
				var filter = new Filter("ReferenzenauszugText", FilterOperator.Contains, sQuery);
				aFilters.push(filter);
			}

			var oList = this.byId("listReferenzenauszug");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilters, "Application");
		},

		onAdd: function () {
			var that = this;
			if (!that._oDialog) {
				Fragment.load({
					name: "TechInnovation.TechInnovation.view.AddForm",
					controller: that
				}).then(function (oDialog) {
					that._oDialog = oDialog;
					that._oDialog.setModel(that.getView().getModel());
					that._oDialog.open();
				}.bind(that));
			} else {
				that._oDialog.open();
			}
		},

		handleCancelPress: function () {
			this._oDialog.close();
		},

		onSort: function () {
			this.oReferenzenauszugList = this.oView.byId("listReferenzenauszug");
			this._bDescendingSort = !this._bDescendingSort;
			var oBinding = this.oReferenzenauszugList.getBinding("items"),
				oSorter = new Sorter("ReferenzenauszugText", this._bDescendingSort);
			oBinding.sort(oSorter);
		},

		handleDelete: function (oEvent) {
			var oItem = oEvent.getParameter("listItem"),
				sPath = oItem.getBindingContext("customJsonModel").getPath(),
				sCollection = sPath.split("/")[1],
				sIndex = sPath.split("/")[2];

			var oJsonData = this.getJsonModel("customJsonModel");
			oJsonData[sCollection].splice(sIndex, 1);
			this.getView().getModel("customJsonModel").setData(oJsonData);
		},

		handleSavePress: function () {
			//values from the input fields
			var refId = sap.ui.getCore().byId("inpId").getValue();
			var refText = sap.ui.getCore().byId("inpText").getValue();
			if (refId === "" || refText === "") {
				MessageToast.show("Please complete all required fields!");

			} else {
				var oJsonData = this.getJsonModel("customJsonModel");
				var newArr = oJsonData["Referenzenauszug"];
				var oNewRef = {
					ReferenzenauszugId: refId,
					ReferenzenauszugText: refText
				};
				newArr.push(oNewRef);
				this.getView().getModel("customJsonModel").setData(oJsonData);
				sap.ui.getCore().byId("inpId").setValue("");
				sap.ui.getCore().byId("inpText").setValue("");
				MessageToast.show("Success");

				this._oDialog.close();
			}
		},

		onShowForm: function (oEvent) {
			this.byId("updateForm").setVisible(true);
			this._onSetPath(oEvent);

		},

		onSaveUpdate: function (oEvent) {
			var sTextUpdate = this.getView().byId("refUpdate").getValue();
			var iId = this.getView().byId("refIdUpdate").getValue();
			var oJsonData = this.getJsonModel("customJsonModel");

			var newArr = oJsonData["Referenzenauszug"];
			var upRef = {
				ReferenzenauszugId: iId,
				ReferenzenauszugText: sTextUpdate
			};
			newArr.splice(iId, 1, upRef);
			this.getView().getModel("customJsonModel").setData(oJsonData);
			this.onCancelUpdate();
		},

		onCancelUpdate: function () {
			this.byId("updateForm").setVisible(false);
			this.getView().byId("refUpdate").setValue("");
			this.getView().byId("refIdUpdate").setValue("");
		},

		_onSetPath: function (oEvent) {
			var oItem = oEvent.getSource(),
				sTitle = oItem.getProperty("title"),
				sPath = oItem.getBindingContext("customJsonModel").getPath(),
				sIndex = sPath.split("/")[2];
			this.getView().byId("refUpdate").setValue(sTitle);
			this.getView().byId("refIdUpdate").setValue(sIndex);
		},
		
		getJsonModel: function (sName) {
			return this.getView().getModel(sName).getData();
		}


	});

});
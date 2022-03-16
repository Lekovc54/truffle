const ora = require("ora");

module.exports = {
  initialization: function () {
    this.logger = (...args) => {
      if (this.quiet) return;
      console.log(...args);
    };

    this.pendingTransactions = {};
  },
  handlers: {
    "rpc:request": [
      function (payload) {
        if (payload.method === "eth_sendTransaction") {
          // TODO: Do we care about ID collisions?
          this.pendingTransactions[payload.id] = payload;

          this.spinner = ora({
            text: `Waiting for transaction signature. Please check your wallet for a transaction approval message.`,
            color: "red"
          });
        }
      }
    ],
    "rpc:result": [
      function (payload, error, result) {
        if (payload.method === "eth_sendTransaction") {
          if (error) {
            const errMessage = `Transaction submission failed with error ${error.code}: '${error.message}'`;
            if (this.spinner?.isSpinning) this.spinner.fail(errMessage);
          } else {
            if (this.spinner?.isSpinning)
              this.spinner.succeed(
                `Transaction submitted successfully. Hash: ${result.result}`
              );
          }

          delete this.pendingTransactions[payload.id];
        }
      }
    ]
  }
};

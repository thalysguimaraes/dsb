import readline from "node:readline/promises";

function normalizeString(value) {
  return value.trim();
}

function normalizeList(value) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function hasValue(value) {
  if (Array.isArray(value)) {
    return value.length > 0;
  }

  return typeof value === "string" ? value.trim().length > 0 : Boolean(value);
}

function getPromptLabel(label, defaultValue) {
  return defaultValue ? `${label} [${defaultValue}]: ` : `${label}: `;
}

export function createPromptSession({ input, output }) {
  const rl = readline.createInterface({ input, output });

  async function ask({
    label,
    defaultValue = "",
    required = false,
    parser = normalizeString
  }) {
    while (true) {
      const rawValue = await rl.question(getPromptLabel(label, defaultValue));
      const candidate = rawValue.trim() ? rawValue : defaultValue;
      const parsed = parser(candidate);

      if (!required || hasValue(parsed)) {
        return parsed;
      }

      output.write(`${label} is required.\n`);
    }
  }

  return {
    askRequired(label, defaultValue = "") {
      return ask({ label, defaultValue, required: true });
    },
    askOptional(label, defaultValue = "") {
      return ask({ label, defaultValue });
    },
    askList(label) {
      return ask({ label, parser: normalizeList });
    },
    async askConfirm(label, defaultValue = true) {
      const suffix = defaultValue ? " [Y/n]: " : " [y/N]: ";

      while (true) {
        const answer = (await rl.question(`${label}${suffix}`)).trim().toLowerCase();

        if (!answer) {
          return defaultValue;
        }

        if (["y", "yes"].includes(answer)) {
          return true;
        }

        if (["n", "no"].includes(answer)) {
          return false;
        }

        output.write("Please answer yes or no.\n");
      }
    },
    close() {
      rl.close();
    }
  };
}

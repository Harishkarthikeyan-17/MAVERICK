from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

class BioMistralLLM:
    def __init__(self):
        self.model_name = "BioMistral/BioMistral-7B"
        self.tokenizer = None
        self.model = None

    def _load(self):
        if self.model is None:
            self.tokenizer = AutoTokenizer.from_pretrained(self.model_name)
            self.model = AutoModelForCausalLM.from_pretrained(
                self.model_name,
                device_map="auto",
                torch_dtype=torch.float16
            )

    def generate(self, prompt):
        self._load()
        inputs = self.tokenizer(prompt, return_tensors="pt").to(self.model.device)

        output = self.model.generate(
            **inputs,
            max_new_tokens=120,
            temperature=0.3
        )

        return self.tokenizer.decode(output[0], skip_special_tokens=True)
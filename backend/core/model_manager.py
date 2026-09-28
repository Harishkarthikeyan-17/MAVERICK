from model.llm_biomistral import BioMistralLLM
from model.embed_pubmedbert import PubMedEmbedder

class ModelManager:
    def __init__(self):
        self.llms = {}
        self.embedders = {}

    def get_llm(self, name="biomistral"):
        if name not in self.llms:
            if name == "biomistral":
                self.llms[name] = BioMistralLLM()
        return self.llms[name]

    def get_embedder(self, name="pubmedbert"):
        if name not in self.embedders:
            if name == "pubmedbert":
                self.embedders[name] = PubMedEmbedder()
        return self.embedders[name]

model_manager = ModelManager()
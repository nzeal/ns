import requests
from bs4 import BeautifulSoup
import json
import os

def get_google_scholar_metrics(user_id):
    """Fetches citation metrics from Google Scholar."""
    url = f"https://scholar.google.com/citations?user={user_id}&hl=en"
    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise HTTPError for bad responses (4xx or 5xx)
        soup = BeautifulSoup(response.content, "html.parser")

        # Extract metrics
        citation_element = soup.find("td", class_="gsc_rsb_std")
        citations = citation_element.text if citation_element else "N/A"

        publication_elements = soup.find_all("td", class_="gsc_rsb_std")
        publications = publication_elements[1].text if len(publication_elements) > 1 else "N/A"

        h_index_element = soup.find("a", class_="gsc_rsb_aa")
        h_index = h_index_element.text if h_index_element else "N/A"

        return {"citations": citations, "publications": publications, "h_index": h_index}

    except requests.exceptions.RequestException as e:
        print(f"Error fetching Google Scholar: {e}")
        return {"citations": "Error", "publications": "Error", "h_index": "Error"}

def update_metrics_json(user_id, output_file="metrics.json"):
    """Updates a JSON file with Google Scholar metrics."""
    metrics = get_google_scholar_metrics(user_id)
    with open(output_file, "w") as f:
        json.dump(metrics, f, indent=4)
    print(f"Metrics updated in {output_file}")

if __name__ == "__main__":
    user_id = "Fs_mg34AAAAJ"  # Replace with your Google Scholar user ID
    update_metrics_json(user_id)
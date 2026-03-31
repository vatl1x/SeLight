from __future__ import annotations

import copy
import re
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
import xml.etree.ElementTree as ET


W_NS = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
XML_NS = "http://www.w3.org/XML/1998/namespace"

NSMAP = {
    "wpc": "http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas",
    "mc": "http://schemas.openxmlformats.org/markup-compatibility/2006",
    "o": "urn:schemas-microsoft-com:office:office",
    "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
    "m": "http://schemas.openxmlformats.org/officeDocument/2006/math",
    "v": "urn:schemas-microsoft-com:vml",
    "wp14": "http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing",
    "wp": "http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing",
    "w10": "urn:schemas-microsoft-com:office:word",
    "w": W_NS,
    "w14": "http://schemas.microsoft.com/office/word/2010/wordml",
    "w15": "http://schemas.microsoft.com/office/word/2012/wordml",
    "w16cex": "http://schemas.microsoft.com/office/word/2018/wordml/cex",
    "w16cid": "http://schemas.microsoft.com/office/word/2016/wordml/cid",
    "w16": "http://schemas.microsoft.com/office/word/2018/wordml",
    "w16du": "http://schemas.microsoft.com/office/word/2023/wordml/word16du",
    "w16sdtdh": "http://schemas.microsoft.com/office/word/2020/wordml/sdtdatahash",
    "w16sdtfl": "http://schemas.microsoft.com/office/word/2024/wordml/sdtformatlock",
    "w16se": "http://schemas.microsoft.com/office/word/2015/wordml/symex",
    "wpg": "http://schemas.microsoft.com/office/word/2010/wordprocessingGroup",
    "wpi": "http://schemas.microsoft.com/office/word/2010/wordprocessingInk",
    "wne": "http://schemas.microsoft.com/office/word/2006/wordml",
    "wps": "http://schemas.microsoft.com/office/word/2010/wordprocessingShape",
    "a": "http://schemas.openxmlformats.org/drawingml/2006/main",
    "pic": "http://schemas.openxmlformats.org/drawingml/2006/picture",
}

for prefix, uri in NSMAP.items():
    ET.register_namespace(prefix, uri)


def w_tag(name: str) -> str:
    return f"{{{W_NS}}}{name}"


def para_text(el: ET.Element) -> str:
    return "".join(t.text or "" for t in el.findall(".//w:t", {"w": W_NS}))


def set_paragraph_text(paragraph: ET.Element, text: str) -> None:
    ppr = paragraph.find("w:pPr", {"w": W_NS})
    first_run = paragraph.find("w:r", {"w": W_NS})
    first_rpr = None
    if first_run is not None:
        first_rpr = first_run.find("w:rPr", {"w": W_NS})

    for child in list(paragraph):
        if child is not ppr:
            paragraph.remove(child)

    run = ET.Element(w_tag("r"))
    if first_rpr is not None:
        run.append(copy.deepcopy(first_rpr))

    text_el = ET.Element(w_tag("t"))
    if text.startswith(" ") or text.endswith(" "):
        text_el.set(f"{{{XML_NS}}}space", "preserve")
    text_el.text = text
    run.append(text_el)
    paragraph.append(run)


def make_heading(template: ET.Element, text: str) -> ET.Element:
    heading = copy.deepcopy(template)
    set_paragraph_text(heading, text)
    return heading


def load_docx_xml(docx_path: Path) -> tuple[dict[str, bytes], ET.Element]:
    files: dict[str, bytes] = {}
    with ZipFile(docx_path) as archive:
        for name in archive.namelist():
            files[name] = archive.read(name)
    root = ET.fromstring(files["word/document.xml"])
    return files, root


def save_docx(files: dict[str, bytes], root: ET.Element, output_path: Path) -> None:
    files["word/document.xml"] = ET.tostring(root, encoding="utf-8", xml_declaration=True)
    with ZipFile(output_path, "w", compression=ZIP_DEFLATED) as archive:
        for name, content in files.items():
            archive.writestr(name, content)


def clone_block(block: ET.Element) -> ET.Element:
    return copy.deepcopy(block)


def chapter_heading(title: str, number: int) -> str:
    return f"Глава {number}. {title}"


def build_report() -> None:
    source = Path("/Users/vatl1x/Desktop/итоговый отчет.docx")
    output = Path("/Users/vatl1x/Documents/iot-selight/итоговый отчет — 7 глав.docx")

    files, root = load_docx_xml(source)
    body = root.find("w:body", {"w": W_NS})
    if body is None:
        raise RuntimeError("word/document.xml does not contain body")

    blocks = list(body)
    sect_pr = clone_block(blocks[-1])

    heading_template = clone_block(blocks[29])
    page_break_template = clone_block(blocks[248])

    # Main title page based on the first title page.
    main_title_blocks = [clone_block(blocks[i]) for i in range(0, 29)]
    set_paragraph_text(main_title_blocks[8], "Итоговый отчет")
    set_paragraph_text(
        main_title_blocks[9],
        "проект «Интеллектуальная система освещения мест общего пользования S.E. Light»",
    )
    set_paragraph_text(main_title_blocks[10], "в 7 главах")

    # Chapter titles. For report 3 and 6 the source title pages are inconsistent,
    # so the names are normalized to keep the report coherent.
    chapters = [
        {
            "title": "Формирование концепции",
            "range": (29, 75),
            "mode": "replace-first",
        },
        {
            "title": "Проектирование программно-аппаратного комплекса",
            "range": (105, 120),
            "mode": "insert-before",
        },
        {
            "title": "Общая реализация проекта",
            "range": (150, 216),
            "mode": "insert-before",
        },
        {
            "title": "Реализация сервера",
            "range": (249, 286),
            "mode": "replace-first",
        },
        {
            "title": "Сервис хранения данных",
            "range": (316, 374),
            "mode": "replace-first",
        },
        {
            "title": "Сервис услуг",
            "range": (403, 520),
            "mode": "insert-before",
        },
        {
            "title": "Приложение для конечного пользователя",
            "range": (549, 712),
            "mode": "insert-before",
        },
    ]

    new_blocks: list[ET.Element] = []
    new_blocks.extend(main_title_blocks)
    new_blocks.append(clone_block(page_break_template))

    for idx, chapter in enumerate(chapters, start=1):
        start, end = chapter["range"]
        chapter_blocks = [clone_block(blocks[i]) for i in range(start, end)]
        title_text = chapter_heading(chapter["title"], idx)

        if chapter["mode"] == "replace-first":
            set_paragraph_text(chapter_blocks[0], title_text)
        else:
            chapter_blocks.insert(0, make_heading(heading_template, title_text))

        if idx > 1:
            new_blocks.append(clone_block(page_break_template))

        new_blocks.extend(chapter_blocks)

    # Remove duplicated page break right after title if chapter 1 already inserted one.
    # The first item after title page is the page break we want, the second one would be extra.
    # So we rebuild again without the accidental extra case.
    compact_blocks: list[ET.Element] = []
    page_break_re = re.compile(r"type=\"page\"")
    previous_was_page_break = False
    for block in new_blocks:
        xml = ET.tostring(block, encoding="unicode")
        is_page_break = bool(page_break_re.search(xml))
        if is_page_break and previous_was_page_break:
            continue
        compact_blocks.append(block)
        previous_was_page_break = is_page_break

    body.clear()
    for block in compact_blocks:
        body.append(block)
    body.append(sect_pr)

    save_docx(files, root, output)
    print(output)


if __name__ == "__main__":
    build_report()

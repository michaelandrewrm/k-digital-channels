# **WAI ARIA**

## Introduction

The W3C Web Accessibility Initiative (WAI) develops technical specifications, guidelines, techniques, and supporting resources that describe accessibility solutions. These are considered international standards for web accessibility; for example, WCAG 2.0 is also an ISO standard: ISO/IEC 40500.

## WAI ARIA Roles

:::warning
Abstract roles are used for the ontology. Authors MUST NOT use abstract roles in content.
:::

### alert
A type of live region with important, and usually time-sensitive, information. See related [alertdialog](#alertdialog) and status.

### alertdialog
A type of dialog that contains an alert message, where initial focus goes to an element within the dialog. See related alert and dialog.

### application
A structure containing one or more focusable elements requiring user input, such as keyboard or gesture events, that do not follow a standard interaction pattern supported by a widget role.

### article
A section of a page that consists of a composition that forms an independent part of a document, page, or site.

### banner
A region that contains mostly site-oriented content, rather than page-specific content.

### button
An input that allows for user-triggered actions when clicked or pressed. See related link.

### cell
A cell in a tabular container. See related gridcell.

### checkbox
A checkable input that has three possible values: true, false, or mixed.

### columnheader
A cell containing header information for a column.

### combobox
A composite widget containing a single-line textbox and another element, such as a listbox or grid, that can dynamically pop up to help the user set the value of the textbox.

### command (abstract role)
A form of widget that performs an action but does not receive input data.

### complementary
A supporting section of the document, designed to be complementary to the main content at a similar level in the DOM hierarchy, but remains meaningful when separated from the main content.

### composite (abstract role)
A widget that may contain navigable descendants or owned children.

### contentinfo
A large perceivable region that contains information about the parent document.

### definition
A definition of a term or concept. See related term.

### dialog
A dialog is a descendant window of the primary window of a web application. For HTML pages, the primary application window is the entire web document, i.e., the body element.

### directory
A list of references to members of a group, such as a static table of contents.

### document
An element containing content that assistive technology users may want to browse in a reading mode.

### feed
A scrollable list of articles where scrolling may cause articles to be added to or removed from either end of the list.

### figure
A perceivable section of content that typically contains a graphical document, images, code snippets, or example text. The parts of a figure MAY be user-navigable.

### form
A landmark region that contains a collection of items and objects that, as a whole, combine to create a form. See related search.

### grid
A composite widget containing a collection of one or more rows with one or more cells where some or all cells in the grid are focusable by using methods of two-dimensional navigation, such as directional arrow keys.

### gridcell
A cell in a grid or treegrid.

### group
A set of user interface objects which are not intended to be included in a page summary or table of contents by assistive technologies.

### heading
A heading for a section of the page.

### img
A container for a collection of elements that form an image.

### input (abstract role)
A generic type of widget that allows user input.

### landmark (abstract role)
A perceivable section containing content that is relevant to a specific, author-specified purpose and sufficiently important that users will likely want to be able to navigate to the section easily and to have it listed in a summary of the page. Such a page summary could be generated dynamically by a user agent or assistive technology.

### link
An interactive reference to an internal or external resource that, when activated, causes the user agent to navigate to that resource. See related button.

### list
A section containing listitem elements. See related listbox.

### listbox
A widget that allows the user to select one or more items from a list of choices. See related combobox and list.

### listitem
A single item in a list or directory.

### log
A type of live region where new information is added in meaningful order and old information may disappear. See related marquee.

### main
The main content of a document.

### marquee
A type of live region where non-essential information changes frequently. See related log.

### math
Content that represents a mathematical expression.

### menu
A type of widget that offers a list of choices to the user.

### menubar
A presentation of menu that usually remains visible and is usually presented horizontally.

### menuitem
An option in a set of choices contained by a menu or menubar.

###menuitemcheckbox
A menuitem with a checkable state whose possible values are true, false, or mixed.

### menuitemradio
A checkable menuitem in a set of elements with the same role, only one of which can be checked at a time.

### navigation
A collection of navigational elements (usually links) for navigating the document or related documents.

### none
An element whose implicit native role semantics will not be mapped to the accessibility API. See synonym presentation.

### note
A section whose content is parenthetic or ancillary to the main content of the resource.

### option
A selectable item in a select list.

### presentation
An element whose implicit native role semantics will not be mapped to the accessibility API. See synonym none.

### progressbar
An element that displays the progress status for tasks that take a long time.

### radio
A checkable input in a group of elements with the same role, only one of which can be checked at a time.

### radiogroup
A group of radio buttons.

### range (abstract role)
An input representing a range of values that can be set by the user.

### region
A perceivable section containing content that is relevant to a specific, author-specified purpose and sufficiently important that users will likely want to be able to navigate to the section easily and to have it listed in a summary of the page. Such a page summary could be generated dynamically by a user agent or assistive technology.

### roletype (abstract role)
The base role from which all other roles in this taxonomy inherit.

### row
A row of cells in a tabular container.

### rowgroup
A structure containing one or more row elements in a tabular container.

### rowheader
A cell containing header information for a row in a grid.

### scrollbar
A graphical object that controls the scrolling of content within a viewing area, regardless of whether the content is fully displayed within the viewing area.

### search
A landmark region that contains a collection of items and objects that, as a whole, combine to create a search facility. See related form and searchbox.

### searchbox
A type of textbox intended for specifying search criteria. See related textbox and search.

### section (abstract role)
A renderable structural containment unit in a document or application.

### sectionhead (abstract role)
A structure that labels or summarizes the topic of its related section.

### select (abstract role)
A form widget that allows the user to make selections from a set of choices.

### separator
A divider that separates and distinguishes sections of content or groups of menuitems.

### slider
A user input where the user selects a value from within a given range.

### spinbutton
A form of range that expects the user to select from among discrete choices.

### status
A type of live region whose content is advisory information for the user but is not important enough to justify an alert, often but not necessarily presented as a 
status bar.

### structure (abstract role)
A document structural element.

### switch
A type of checkbox that represents on/off values, as opposed to checked/unchecked values. See related checkbox.

### tab
A grouping label providing a mechanism for selecting the tab content that is to be rendered to the user.

### table
A section containing data arranged in rows and columns. See related grid.

### tablist
A list of tab elements, which are references to tabpanel elements.

### tabpanel
A container for the resources associated with a tab, where each tab is contained in a tablist.

### term
A word or phrase with a corresponding definition. See related definition.

### textbox
A type of input that allows free-form text as its value.

### timer
A type of live region containing a numerical counter which indicates an amount of elapsed time from a start point, or the time remaining until an end point.

### toolbar
A collection of commonly used function buttons or controls represented in compact visual form.

### tooltip
A contextual popup that displays a description for an element.

### tree
A type of list that may contain sub-level nested groups that can be collapsed and expanded.

### treegrid
A grid whose rows can be expanded and collapsed in the same manner as for a tree.

### treeitem
An option item of a tree. This is an element within a tree that may be expanded or collapsed if it contains a sub-level group of tree item elements.

### widget (abstract role)
An interactive component of a graphical user interface (GUI).

### window (abstract role)
A browser or application window.

## Rules of ARIA attributes usage by HTML language feature

The following table provides normative per-element document-conformance requirements for the use of ARIA markup in HTML documents and describes the implicit ARIA semantics that apply to HTML elements as defined in the HTML Accessibility API Mappings 1.0 [html-aam-1.0] specification. Each language feature (element or attribute) in the first line implies the ARIA semantics (any role, states, and properties) given in the second line implies the implicit ARIA semantic which **SHOULD NOT be used**. The third line defines which ARIA role values and `aria-*` attributes which **MAY be used**. Where in the third line includes the term *Any role* it indicates that any role value apart from the implicit ARIA semantics role value, **MAY be used**.

:::tip NOTE
Setting an ARIA role and/or `aria-*` attribute that matches the implicit ARIA semantics is unnecessary and is **NOT RECOMMENDED** as these properties are already set by the browser.
:::

`<a>` elements with a `href` <br/>
**Should not be used:** `role=link` <br/>
**May be used:**
>Roles: [`button`](#button), [`checkbox`](#checkbox), [`menuitem`](#menuitem), [`menuitemcheckbox`](#menuitemcheckbox), [`menuitemradio`](#menuitemradio), [`option`](#option), [`radio`](#radio), [`switch`](#switch), [`tab`](#tab), [`treeitem`](#treeitem) or global `aria-*` attributes and any `aria-*` attributes applicable to the allowed roles and implied role (if any)

`<a>` elements without a `href` <br/>
**Should not be used:** **No corresponding role** <br/>
**May be used:**
>**Any** role or global `aria-*` attributes and any `aria-*` attributes applicable to the allowed roles and implied role (if any)

`<abbr>` <br/>
**Should not be used:** **No corresponding role** <br/>
**May be used:**
>**Any** role or global `aria-*` attributes and any `aria-*` attributes applicable to the allowed roles and implied role (if any)

`<address>` <br/>
**Should not be used:** **No corresponding role** <br/>
**May be used:**
>**Any** role or global `aria-*` attributes and any `aria-*` attributes applicable to the link role.

`<area>` with a `href` <br/>
**Should not be used:** `role=link` <br/>
**May be used:**
>**No** role** or global `aria-*` attributes and any `aria-*` attributes applicable to the allowed roles and implied role (if any)

`<area>` without a `href` <br/>
**Should not be used:** **No corresponding role** <br/>
**May be used:**
>**No** role** or global `aria-*` attributes and any `aria-*` attributes applicable to the allowed roles and implied role (if any)

`<article>` <br/>
**Should not be used:** `role=article` <br/>
**May be used:**
>Roles: [`feed`](#feed), [`presentation`](#presentation), [`none`](#none), [`document`](#document), [`application`](#application), [`main`](#main), [`region`](#region) or global `aria-*` attributes and any `aria-*` attributes applicable to the allowed roles and implied role (if any)

`<aside>` <br/>
**Should not be used:** `role=complementary` <br/>
**May be used:**
>Roles: [`feed`](#feed), [`presentation`](#presentation), [`none`](#none), [`region`](#region), [`search`](#search) or global `aria-*` attributes and any `aria-*` attributes applicable to the allowed roles and implied role (if any)

`<audio>` <br/>
**Should not br used:** **No corresponding role** <br/>
**May be used:**
>Roles: [`application`](#application) or global `aria-*` attributes and any `aria-*` attributes applicable to the allowed roles and implied role (if any)

`<base>` <br/>
**Should not br used:** **No corresponding role** <br/>
**May be used:**
>**No** role **or** `aria-*` **attributes**

`<body>` <br/>
**Should not be used:** `role=document` <br/>
**May be used:**
>**No** role or global `aria-*` attributes and any `aria-*` attributes applicable to the [`document`](#document) role

`<button>` <br/>
**Should not be used:** `role=button` <br/>
**May be used:**
>Roles: [`checkbox`](#checkbox), [`link`](#link), [`menuitem`](#menuitem), [`menuitemcheckbox`](#menuitemcheckbox), [`menuitemradio`](#menuitemradio), [`option`](#option), [`radio`](#radio), [`switch`](#switch), [`tab`](#tab) or global `aria-*` attributes and any `aria-*` attributes applicable to the allowed roles and implied role (if any)

`<button type="menu" />` <br/>
**Should not be used:** `role=button` <br/>
**May be used:**
>Roles: [`menuitem`](#menuitem) or global `aria-*` attributes and any `aria-*` attributes applicable to the allowed roles and implied role (if any) (changed)

`<canvas>` <br/>
**Should not be used:** **No corresponding role** <br/>
**May be used:**
>**Any** role or global `aria-*` attributes and any `aria-*` attributes applicable to the allowed roles and implied role (if any)

`<caption>`	<br/>
**Should not be used:** **No corresponding role** <br/>
**May be used:**
>**No** role or global `aria-*` attributes

`<col>` `<colgroup>` <br />
**Should not be used:** **No corresponding role** <br/>
**May be used:**
>**No** role or `aria-*` attributes

`<datalist>` <br/>
**Should not be used:** `role=listbox` <br/>
**May be used:**
>**No** role or global `aria-*` attributes and any `aria-*` attributes applicable to the [`listbox`](#listbox) role.

`<dd>` <br/>
**Should not be used:** `role=definition` <br/>
**May be used:**
>**No** role or global `aria-*` attributes and any `aria-*` attributes applicable to the [`definition`](#definition) role.

`<details>` <br/>
**Should not be used:** `role=group` <br/>
**May be used:**
>**No** role or global `aria-*` attributes and any `aria-*` attributes applicable to the [`group`](#group) role.

`<dialog>` <br/>
**Should not be used:** `role=dialog` <br/>
**May be used:**
>Roles: [`alertdialog`](#alertdialog) or global `aria-*` attributes and any `aria-*` attributes applicable to the [`dialog`](#dialog) role.

`<div>` <br/>
**Should not be used:** **No corresponding role** <br/>
**May be used:**
>**Any** role or global `aria-*` attributes and any `aria-*` attributes applicable to the allowed roles and implied role (if any)

`<dl>` <br/>
**Should not be used:** **No corresponding role** <br/>
**May be used:**
>Roles: [`group`](#group), [`list`](#list), [`presentation`](#presentation), [`none`](#none) or global `aria-*` attributes and any `aria-*` attributes applicable to the allowed roles and implied role (if any)

`<dt>` <br/>
**Should not be used:** `role=term` <br/>
>Roles: [`listitem`](#listitem) or global `aria-*` attributes and any `aria-*` attributes applicable to the allowed roles and implied role (if any)

`<embed>` <br/>
**Should not be used:** **No corresponding role** <br/>
**May be used:**
>Roles: [`application`](#application), [`document`](#document), [`presentation`](#presentation), [`none`](#none), [`img`](#img) or global `aria-*` attributes and any `aria-*` attributes applicable to the allowed roles and implied role (if any)

`<figcaption>` <br/>
**Should not be used:** **No corresponding role** <br/>
**May be used:**
>Roles: [`group`](#group), [`presentation`](#presentation), [`none`](#none) or global `aria-*` attributes and any `aria-*` attributes applicable to the allowed roles and implied role (if any)

`<fieldset>` <br/>
**Should not be used:** `role=group` <br/>
**May be used:**
>Roles: [`radiogroup`](#radiogroup), [`none`](#none), [`presentation`](#presentation) or global `aria-*` attributes and any `aria-*` attributes applicable to the allowed roles and implied role (if any)

`<figure>` <br/>
**Should not be used:** `role=figure` <br/>
**May be used:**
>Roles: [`group`](#group), [`none`](#none) or [`presentation`](#presentation) or global `aria-*` attributes and any `aria-*` attributes applicable to the allowed roles and implied role (if any)

`<footer>` <br/>
**Should not be used:** If not a descendant of an `article` `aside` `main` `nav` or `section` element with `role=contentinfo`, otherwise **No corresponding role** <br/>
**May be used:**
>Roles: [`group`](#group), [`none`](#none), [`presentation`](#presentation) or global `aria-*` attributes and any `aria-*` attributes applicable to the allowed

`<form>` <br/>
**Should not be used:** `role=form` if the form element has an accessible name. Otherwise, *No corresponding role*.
**May be used:**
>Roles: [`search`](#search), [`none`](#none), [`presentation`](#presentation) or global `aria-*` attributes and any `aria-*` attributes applicable to the allowed roles and implied role (if any)

grouping content elements not listed elsewhere: `<p>`, `<pre>`, `<blockquote>` <br/>
**Should not be used:** **No corresponding role** <br/>
**May be used:**
>**Any** role or global `aria-*` attributes and any `aria-*` attributes applicable to the allowed roles and implied role (if any)

`<h1>` to `<h6>` element <br/>
**Should not be used:** `role=heading`, with the aria-level = positive integer <br/>
**May be used:**
>Roles: [`tab`](#tab), [`none`](#none), [`presentation`](#presentation) or global `aria-*` attributes and any `aria-*` attributes applicable to the allowed roles and implied role (if any)

`<head>` <br/>
**Should not be used:** **No corresponding role** <br/>
**May be used:**
>**No** role or `aria-*` attributes

`<header>` <br/>
**Should not be used:** If not a descendant of an `article`, `aside`, `main`, `nav` or `section` element with `role=banner`, otherwise **No corresponding role** <br/>
**May be used:**
>Roles: [`group`](#group), [`none`](#none), [`presentation`](#presentation) or global `aria-*` attributes and any `aria-*` attributes applicable to the allowed

`<hgroup>`
**Should not be used:** **No corresponding role** <br/>
**May be used:**
>**Any** role or global `aria-*` attributes and any `aria-*` attributes applicable to the allowed roles and implied role (if any)

`<hr>` <br/>
**Should not be used:** `role=separator` <br/>
>Roles: [`none`](#none), [`presentation`](#presentation) or global `aria-*` attributes and any `aria-*` attributes applicable to the separator role.

`<html>`
**Should not be used:** **No corresponding role** <br/>
**May be used:**
>**No** role or `aria-*` attributes

`<iframe>` <br/>
**Should not be used:** **No corresponding role** <br/>
**May be used:**
>Roles: [`application`](#application), [`document`](#document), [`none`](#none), [`presentation`](#presentation), [`img`](#img) or global `aria-*` attributes and any `aria-*` attributes applicable to the allowed roles and implied role (if any)

`<img>` with alt="" <br/>
**Should not be used:** **No corresponding role** <br/>
**May be used:**
>Roles: [`none`](#none), [`presentation`](#presentation) **No** `aria-*` attributes except aria-hidden (changed)

`<img>` with alt="some text" <br/>
**Should not be used:** `role=img` <br/>
**May be used:**
>**Any** role except [`presentation`](#presentation), [`none`](#none) or global `aria-*` attributes and any `aria-*` attributes applicable to the allowed roles and implied role (if any)

`<input>` type=button <br/>
**Should not be used:** `role=button` <br/>
**May be used:**
>Roles: [`link`](#link), [`menuitem`](#menuitem), [`menuitemcheckbox`](#menuitemcheckbox), [`menuitemradio`](#menuitemradio), [`option`](#option), [`radio`](#radio), [`switch`](#switch), [`tab`](#tab) or global `aria-*` attributes and any `aria-*` attributes applicable to the allowed roles and implied role (if any)

`<input>` type=checkbox <br/>
**Should not be used:** `role=checkbox` <br/>
**May be used:**
>Roles: [`button`](#button) (when used in conjunction with aria-pressed), [`menuitemcheckbox`](#menuitemcheckbox), [`option`](#option), [`switch`](#switch) or global `aria-*` attributes and any `aria-*` attributes applicable to the allowed roles and implied role (if any)

**Note:** the HTML checked attribute may be used instead of the aria-checked attribute for menuitemcheckbox, option or switch when used on type=checkbox.

`<input>` type=color <br/>
**Should not be used:** **No corresponding role** <br/>
**May be used:**
>**No** role or global `aria-*` attributes

`<input>` type=date <br/>
**Should not be used:** **No corresponding role** <br/>
**May be used:**
>**No** role or global `aria-*` attributes

`<input>` type=datetime-local <br/>
**Should not be used:** **No corresponding role** <br/>
**May be used:**
>**No** role or global `aria-*` attributes

`<input>` type=email with no list attribute <br/>
**Should not be used:** `role=textbox` <br/>
**May be used:**
>**No** role or global `aria-*` attributes and any `aria-*` attributes applicable to the textbox role

`<input>` type=file <br/>
**Should not be used:** **No corresponding role** <br/>
**May be used:**
>**No** role or global `aria-*` attributes

`<input>` type=hidden <br/>
**Should not be used:** **No corresponding role** <br/>
**May be used:**
>**No** role or aria* attributes

`<input>` type=image <br/>
**Should not be used:** `role=button`
>Roles: [`link`](#link), [`menuitem`](#menuitem), [`menuitemcheckbox`](#menuitemcheckbox), [`menuitemradio`](#menuitemradio), [`radio`](#radio), [`switch`](#switch) or global `aria-*` attributes and any `aria-*` attributes applicable to the allowed roles and implied role (if any)

`<input>` type=month <br/>
**Should not be used:** **No corresponding role** <br/>
**May be used:**
>**No** role or global `aria-*` attributes

`<input>` type=number <br/>
**Should not be used:** `role=spinbutton` <br/>
**May be used:**
>**No** role or global `aria-*` attributes and any `aria-*` attributes applicable to the spinbutton role.

`<input>` type=password <br/>
**Should not be used:** *No corresponding role* - (changed) <br/>
**May be used:**
>**No** role or global `aria-*` attributes and aria-required - (changed)

`<input>` type=radio <br/>
**Should not be used:** `role=radio` <br/>
**May be used:**
>Roles: [`menuitemradio`](#menuitemradio) or global `aria-*` attributes and any `aria-*` attributes applicable to the menuitemradio role.

**Note:** the HTML checked attribute may be used instead of the aria-checked attribute for menuitemradio when used on type=checkbox. (changed)

`<input>` type=range <br/>
**Should not be used:** `role=slider` <br/>
**May be used:**
>**No** role or global `aria-*` attributes and any `aria-*` attributes applicable to the slider role.

`<input>` type= reset <br/>
**Should not be used:** `role=button` <br/>
**May be used:**
>**No** role or global `aria-*` attributes and any `aria-*` attributes applicable to the button role.

`<input>` type=search, with no list attribute <br/>
**Should not be used:** `role=searchbox` - (new) <br/>
**May be used:**
>**No** role or global `aria-*` attributes and any `aria-*` attributes applicable to the searchbox role.

`<input>` type=submit <br/>
**Should not be used:** `role=button` <br/>
**May be used:**
>**No** role or global `aria-*` attributes and any `aria-*` attributes applicable to the button role.

`<input>` type=tel, with no list attribute <br/>
**Should not be used:** `role=textbox` <br/>
**May be used:**
>**No** role or global `aria-*` attributes and any `aria-*` attributes applicable to the textbox role.

`<input>` type=text, with no list attribute <br/>
**Should not be used:** `role=textbox` <br/>
**May be used:**
>Roles: [`combobox`](#combobox), [`searchbox`](#searchbox), [`spinbutton`](#spinbutton) or global `aria-*` attributes and any `aria-*` attributes applicable to the allowed roles.

`<input>` type=text, search, tel, url, or email with a list attribute <br/>
**Should not be used:** `role=combobox` <br/>
**May be used:**
>**No** role or global `aria-*` attributes and any `aria-*` attributes applicable to the combobox role.

`<input>` type=time <br/>
**Should not be used:** **No corresponding role** <br/>
**May be used:**
>**No** role or global `aria-*` attributes

`<input>` type=url with no list attribute <br/>
**Should not be used:** `role=textbox` <br/>
**May be used:**
>**No** role or global `aria-*` attributes and any `aria-*` attributes applicable to the textbox role.

`<input>` type=week <br/>
**Should not be used:** **No corresponding role** <br/>
**May be used:**
>**No** role or global `aria-*` attributes

`<ins>` and `<del>` <br/>
**Should not be used:** **No corresponding role** <br/>
**May be used:**
>**Any** role or global `aria-*` attributes and any `aria-*` attributes applicable to the allowed roles and implied role (if any)

`<label>` <br/>
**Should not be used:** **No corresponding role** <br/>
**May be used:**
>**No** role or global `aria-*` attributes

`<legend>` <br/>
**Should not be used:** **No corresponding role** <br/>
**May be used:**
>**No** role or global `aria-*` attributes

`<li>` element whose parent is an ol or ul <br/>
**Should not be used:** `role=listitem` <br/>
**May be used:**
>Roles: [`menuitem`](#menuitem), [`menuitemcheckbox`](#menuitemcheckbox), [`menuitemradio`](#menuitemradio), [`option`](#option), [`none`](#none), [`presentation`](#presentation), [`radio`](#radio), [`separator`](#radio), [`tab`](#tab), [`treeitem`](#tab) or global `aria-*` attributes and any `aria-*` attributes applicable to the allowed roles and implied role (if any)

`<link>` element with a href <br/>
**Should not be used:** `role=link` <br/>
**May be used:**
>**No** role or `aria-*` attributes

`<main>` <br/>
**Should not be used:** `role=main` <br/>
**May be used:**
>**No** role or global `aria-*` attributes and any `aria-*` attributes applicable to the `main` role.

`<map>` <br/>
**Should not be used:** **No corresponding role** <br/>
**May be used:**
>**No** role or `aria-*` attributes

`<math>` <br/>
**Should not be used:** `role=math` <br/>
**May be used:**
>**No** role or global `aria-*` attributes and any `aria-*` attributes applicable to the math role.

`<meta>` <br/>
**Should not be used:** **No corresponding role** <br/>
**May be used:**
>**No** role or `aria-*` attributes

`<meter>` <br/>
**Should not be used:** **No corresponding role** <br/>
**May be used:**
>**No** role or global `aria-*` attributes

`<nav>` <br/>
**Should not be used:** `role=navigation` <br/>
**May be used:**
>global `aria-*` attributes and any `aria-*` attributes applicable to the `navigation` role.

`<noscript>`
**Should not be used:** **No corresponding role** <br/>
**May be used:**
>**No** role or `aria-*` attributes

`<object>`
**Should not be used:** **No corresponding role** <br/>
**May be used:**
>Roles: [`application`](#application), [`document`](#document), [`img`](#img) or global `aria-*` attributes and any `aria-*` attributes applicable to the allowed roles and implied role (if any)

`<ol>` <br/>
**Should not be used:** `role=list` <br/>
>Roles: [`directory`](#directory), [`group`](#group), [`listbox`](#listbox), [`menu`](#menu), [`menubar`](#menubar), [`none`](#none), [`presentation`](#presentation), [`radiogroup`](#radiogroup) - (changed), [`tablist`](#tablist), [`toolbar`](#toolbar), [`tree`](#tree) or global `aria-*` attributes and any `aria-*` attributes applicable to the allowed roles and implied role (if any)

`<optgroup>` <br/>
**Should not be used:** `role=group` <br/>
**May be used:**
>**No** role or global `aria-*` attributes and any `aria-*` attributes applicable to the group role.

`<option>` element that is in a list of options or that represents a suggestion in a datalist <br/>
**Should not be used:** `role=option` <br/>
**May be used:**
>**No** role or global `aria-*` attributes and any `aria-*` attributes applicable to the option role.

`<output>` <br/>
**Should not be used:** `role=status`<br/>
**May be used:**
>**Any** role or global `aria-*` attributes and any `aria-*` attributes applicable to the allowed roles and implied role (if any)

`<param>` <br/>
**Should not be used:** **No corresponding role** <br/>
**May be used:**
>**No** role or `aria-*` attributes

`<picture>` <br/>
**Should not be used:** **No corresponding role** <br/>
**May be used:**
>**No** role or aria* attributes

`<progress>` <br/>
**Should not be used:** `role=progressbar` <br/>
**May be used:**
>**No** role or global `aria-*` attributes and any `aria-*` attributes applicable to the progressbar role.

`<script>` <br/>
**Should not be used:** **No corresponding role**. <br/>
**May be used:**
>**No** role or `aria-*` attributes

`<section>` <br/>
**Should not be used:** `role=region` if the section element has an accessible name. Otherwise, **No corresponding role** <br/>
**May be used:**
>Roles: [`alert`](#alert), [`alertdialog`](#alertdialog), [`application`](#application), [`banner`](#banner), [`complementary`](#complementary), [`contentinfo`](#contentinfo), [`dialog`](#dialog), [`document`](#document), [`feed`](#feed), [`log`](#log), [`main`](#main), [`marquee`](#marquee), [`navigation`](#navigation), [`none`](#none), [`presentation`](#presentation), [`search`](#search), [`status`](#status), [`tabpanel`](#tabpanel) or global `aria-*` attributes and any `aria-*` attributes applicable to the allowed roles and implied role (if any)

`<select>` (with NO multiple attribute and NO size attribute having value greater than 1) <br/>
**Should not be used:** `role=combobox` <br/>
**May be used:**
>[`menu`](#menu) or global `aria-*` attributes and any `aria-*` attributes applicable to the combobox or `menu` role.

`<select>` (with a multiple attribute or a size attribute having value greater than 1) (new)	<br/>
**Should not be used:** `role=listbox` <br/>	
>**No** role or global `aria-*` attributes and any `aria-*` attributes applicable to the `listbox` role.

`<slot>` <br/>
**Should not be used:** **No corresponding role** <br/>
**May be used:**
>**No** role or `aria-*` attributes

`<source>` <br/>
**Should not be used:** **No corresponding role** <br/>
**May be used:**
>**No** role or `aria-*` attributes

`<span>` <br/>
**Should not be used:** **No corresponding role** <br/>
**May be used:**
>**Any** role or global `aria-*` attributes and any `aria-*` attributes applicable to the allowed roles and implied role (if any)

`<style>` <br/>
**Should not be used:** **No corresponding role** <br/>
**May be used:**
>**No** role or `aria-*` attributes

`<SVG>` <br/>
**Should not be used:** **No corresponding role** <br/>
**May be used:**
>Roles: [`application`](#application), [`document`](#document), [`img`](#img) or global `aria-*` attributes and any `aria-*` attributes applicable to the allowed roles and implied role (if any)

`<summary>` <br/>
**Should not be used:** `role=button` <br/>
**May be used:**
>Roles: [`button`](#button) with `aria-expanded="true"` if the parent (details) element's open attribute is present, `aria-expanded="false"` otherwise or global `aria-*` attributes and any `aria-*` attributes applicable to the `button` role.

`<table>` <br/>
**Should not be used:** `role=table` - (new) <br/>
**May be used:**
>**Any** role or global `aria-*` attributes and any `aria-*` attributes applicable to the allowed roles and implied role (if any)

`<template>`
**Should not be used:** **No corresponding role** <br/>
**May be used:**
>**No** role or `aria-*` attributes

`<textarea>` <br/>
**Should not be used:** `role=textbox` <br/>
**May be used:**
>**No** role or global `aria-*` attributes and any `aria-*` attributes applicable to the textbox role.

`<tbody>`, `<thead>`, `<tfoot>` <br/>
**Should not be used:** `role=rowgroup` <br/>
**May be used:**
>**Any** role or global `aria-*` attributes and any `aria-*`attributes applicable to the allowed roles and implied role (if any).

`<title>`<br/>
**Should not be used:** **No corresponding role** <br/>
**May be used:**
>**No** role or `aria-*` attributes

`<td>` <br/>
**Should not be used:** role=cell if a descendant of a table element <br/>
**May be used:**
>**Any** role or global `aria-*` attributes and any `aria-*` attributes applicable to the allowed roles and implied role (if any)

Text level semantic elements not listed elsewhere:
`<em>` `<i>` `<strong>` `<small>` `<s>` `<cite>` `<q>` `<dfn>` `<abbr>` `<time>` `<code>` `<var>` `<samp>` `<kbd>` `<sub and sup>` `<b>` `<u>` `<mark>` `<ruby>` `<rp>` `<rt>` `<bdi>` `<bdo>` `<br>` `<wbr>` <br/>
**Should not be used:** **No corresponding role** <br/>
**May be used:****May be used:**
>**Any** role or global `aria-*` attributes and any `aria-*` attributes applicable to the allowed roles and implied role (if any)

`<th>` <br/>
**Should not be used:** `role=columnheader` or `rowheader` <br/>
**May be used:**
>**Any** role or global `aria-*` attributes and any `aria-*` attributes applicable to the allowed roles and implied role (if any)

`<tr>` <br/>
**Should not be used:** `role=row`, may be explicitly declared when child of a table element with role=grid	<br/>
**May be used:**
>**Any** role or global `aria-*` attributes and any `aria-*` attributes applicable to the allowed roles and implied role (if any)

`<track>` <br/>
**Should not be used:** **No corresponding role** <br/>
**May be used:**
>**No** role or `aria-*` attributes

`<ul>` <br/>
**Should not be used:** `role=list` <br/>
**May be used:**
>Roles: [`directory`](#directory), [`group`](#group), [`listbox`](#listbox), [`menu`](#menu), [`menubar`](#menubar), [`radiogroup`](#radiogroup), [`tablist`](#tablist), [`toolbar`](#toolbar), [`tree`](#tree), [`presentation`](#presentation), [`none`](#none) or global `aria-*` attributes and any `aria-*` attributes applicable to the allowed roles and implied role (if any)

`<video>`
**Should not be used:** **No corresponding role** <br/>
**May be used:**
>Roles: [`application`](#application) or global `aria-*` attributes and any `aria-*` attributes applicable to the application role.

Element with a disabled attribute <br/>
**Should not be used:** `aria-disabled="true"` <br/>
**May be used:**
>Use the disabled attribute on any element that is allowed the disabled attribute in HTML5. Only use the aria-disabled attribute for elements that are not allowed to have a disabled attribute in HTML5

Element with a placeholder attribute - (new) <br/>
**Should not be used:** `aria-placeholder=""` <br/>
**May be used:**
>Use the placeholder attribute on any element that is allowed the placeholder attribute in HTML5. Only use the aria-placeholder attribute on elements that are not allowed to have a placeholder attribute in HTML5.

Element with a required attribute <br/>
**Should not be used:** `aria-required="true"`<br/>
**May be used:**
>Use the aria-required attribute on any element that is allowed the required attribute in HTML5. MUST NOT be set to false if the required attribute is set.

>MAY also be used for elements that have an ARIA role which allows the aria-required attribute.

Element with a readonly attribute <br/>
**Should not be used:** `aria-readonly="true"` <br/>
**May be used:**
>Use the readonly attribute on any element that is allowed the readonly attribute in HTML5.
>Only use the aria-readonly attribute for elements that are not allowed to have a readonly attribute in HTML5

Element with a hidden attribute <br/>
**Should not be used:** `aria-hidden="true"` <br/>
**May be used:**
>Use the aria-hidden attribute on any HTML element.
**Note:** If an element has a hidden attribute, an aria-hidden attribute is not required.

Element that is a candidate for constraint validation but that does not satisfy its constraints	<br/>
**Should not be used:** `aria-invalid="true"` <br/>
**May be used:**
>The `aria-invalid` attribute may be used on any HTML5 element that allows global `aria-*` attributes except for a submittable element that does not satisfy its validation constraints.

Element with contenteditable attribute	<br/>
**Should not be used:** `aria-readonly="false"` <br/>
**May be used:**
>Do not set `aria-readonly="true"` on an element that has a contenteditable attribute set.
export default {
  title: 'Block Content',
  name: 'blockContent',
  type: 'array',
  of: [
    {
      title: 'Block',
      type: 'block',
      styles: [
        {title: 'Normal', value: 'normal'},
        {title: 'H2', value: 'h2'},
        {title: 'H3', value: 'h3'},
        {title: 'H4', value: 'h4'},
        {title: 'Quote', value: 'blockquote'}
      ],
      lists: [
        {title: 'Bullet', value: 'bullet'},
        {title: 'Numbered', value: 'number'}
      ],
      marks: {
        decorators: [
          {title: 'Strong', value: 'strong'},
          {title: 'Emphasis', value: 'em'}
        ],
        annotations: [
          {
            title: 'URL',
            name: 'link',
            type: 'object',
            fields: [
              {
                title: 'URL',
                name: 'href',
                type: 'url'
              }
            ]
          }
        ]
      }
    },
    {
      type: 'image',
      options: {hotspot: true},
      fields: [
        {
          name: 'caption',
          type: 'string',
          title: 'Image Caption'
        },
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text'
        }
      ]
    },
    {
      name: 'code',
      title: 'Code Block',
      type: 'object',
      fields: [
        {
          name: 'language',
          title: 'Language',
          type: 'string',
          options: {
            list: [
              {title: 'JavaScript', value: 'javascript'},
              {title: 'TypeScript', value: 'typescript'},
              {title: 'Python', value: 'python'},
              {title: 'CSS', value: 'css'},
              {title: 'HTML', value: 'html'},
              {title: 'JSON', value: 'json'}
            ]
          }
        },
        {
          name: 'code',
          title: 'Code',
          type: 'text'
        }
      ]
    }
  ]
}